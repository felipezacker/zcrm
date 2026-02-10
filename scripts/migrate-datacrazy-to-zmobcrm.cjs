#!/usr/bin/env node
/**
 * DataCrazy → ZmobCRM Full Data Migration
 * =========================================
 * Migrates ALL data from DataCrazy CRM dump files into ZmobCRM (Supabase).
 *
 * Prerequisites:
 *   1. Run schema migration: 20260210000000_datacrazy_staging.sql
 *   2. Set env vars: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (or SERVICE_ROLE_KEY)
 *   3. Data dumps in: data/dumps/
 *
 * Usage:
 *   node scripts/migrate-datacrazy-to-zmobcrm.cjs [--dry-run] [--entity=contacts]
 *
 * Options:
 *   --dry-run       Validate only, no writes
 *   --entity=X      Migrate single entity (tags, products, boards, stages, contacts, deals, deal_items, activities, loss_reasons)
 *   --force         Skip confirmation prompt
 *   --batch=N       Batch size (default: 500)
 *
 * Author: Dara (data-engineer) | 2026-02-10
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, '..');
const DUMPS_DIR = path.join(ROOT, 'data', 'dumps');

const BATCH_SIZE = parseInt(process.argv.find(a => a.startsWith('--batch='))?.split('=')[1] || '500', 10);
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
const SINGLE_ENTITY = process.argv.find(a => a.startsWith('--entity='))?.split('=')[1];

// Colors for console
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function loadJSON(filename) {
  const filepath = path.join(DUMPS_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`${c.red}[ERROR] File not found: ${filepath}${c.reset}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(raw);
}

function log(emoji, msg) {
  const ts = new Date().toISOString().substr(11, 8);
  console.log(`${c.dim}[${ts}]${c.reset} ${emoji} ${msg}`);
}

function progress(current, total, label) {
  const pct = ((current / total) * 100).toFixed(1);
  process.stdout.write(`\r  ${c.cyan}[${pct}%]${c.reset} ${label}: ${current}/${total}`);
  if (current === total) console.log(` ${c.green}done${c.reset}`);
}

async function batchUpsert(supabase, table, rows, conflictKey, label) {
  if (DRY_RUN) {
    log('🔍', `${c.yellow}[DRY-RUN]${c.reset} Would upsert ${rows.length} rows into ${table}`);
    return { inserted: 0, errors: [] };
  }

  let inserted = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from(table)
      .upsert(batch, {
        onConflict: conflictKey,
        ignoreDuplicates: false,
      });

    if (error) {
      errors.push({ batch: i, error: error.message, details: error.details });
      // Try row by row for this batch
      for (const row of batch) {
        const { error: rowErr } = await supabase
          .from(table)
          .upsert([row], { onConflict: conflictKey, ignoreDuplicates: true });
        if (rowErr) {
          errors.push({ id: row.id || row.contact_id, error: rowErr.message });
        } else {
          inserted++;
        }
      }
    } else {
      inserted += batch.length;
    }
    progress(Math.min(i + BATCH_SIZE, rows.length), rows.length, label);
  }

  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// ENTITY MIGRATION FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * 1. TAGS
 */
function prepareTags(rawTags, orgId) {
  return rawTags.map(t => ({
    id: t.id,
    name: t.name.trim(),
    color: t.color || 'bg-gray-500',
    organization_id: orgId,
    created_at: t.createdAt,
  }));
}

/**
 * 2. LOSS REASONS
 */
function prepareLossReasons(rawReasons, orgId) {
  return rawReasons.map(r => ({
    id: r.id,
    name: r.name.trim(),
    requires_justification: r.requiredJustification || false,
    organization_id: orgId,
    created_at: r.createdAt,
  }));
}

/**
 * 3. PRODUCTS
 */
function prepareProducts(rawProducts, orgId) {
  return rawProducts.map(p => ({
    id: p.id,
    name: p.name.trim(),
    sku: (p.id_sku || '').trim() || null,
    price: p.price, // Values are in reais (integer)
    active: true,
    image: p.image || null,
    datacrazy_id: p.id,
    organization_id: orgId,
    created_at: p.createdAt,
    updated_at: p.createdAt,
  }));
}

/**
 * 4. BOARDS (from pipelines)
 */
function prepareBoards(rawPipelines, orgId) {
  return rawPipelines.map((p, idx) => ({
    id: p.id,
    name: p.name.trim(),
    description: p.description || null,
    type: 'SALES',
    is_default: idx === 0,
    position: idx,
    organization_id: orgId,
    created_at: p.createdAt,
    updated_at: p.createdAt,
  }));
}

/**
 * 5. BOARD STAGES (from pipeline stages)
 * Also creates placeholder stages for stageIds referenced by deals but missing from dump.
 */
function prepareBoardStages(rawStages, rawBusinesses, orgId) {
  const rows = [];
  const knownIds = new Set();

  for (const [pipelineId, stages] of Object.entries(rawStages)) {
    for (const s of stages) {
      knownIds.add(s.id);
      rows.push({
        id: s.id,
        board_id: pipelineId,
        name: s.name.trim(),
        label: s.name.trim(),
        color: s.color || '#3B82F6',
        order: s.index,
        is_default: s.index === 0,
        organization_id: orgId,
        created_at: s.createdAt,
      });
    }
  }

  // Find missing stageIds from businesses and create placeholders
  const firstBoardId = Object.keys(rawStages)[0];
  const maxOrder = Math.max(...Object.values(rawStages).flat().map(s => s.index), 0);
  const missingIds = new Set();
  let placeholderIdx = 0;

  for (const b of rawBusinesses) {
    if (b.stageId && !(knownIds.has(b.stageId)) && !(missingIds.has(b.stageId))) {
      missingIds.add(b.stageId);
      placeholderIdx++;
      rows.push({
        id: b.stageId,
        board_id: firstBoardId,
        name: `[Migrado] Stage ${placeholderIdx}`,
        label: `[Migrado] Stage ${placeholderIdx}`,
        color: '#9CA3AF',
        order: maxOrder + placeholderIdx,
        is_default: false,
        organization_id: orgId,
        created_at: new Date().toISOString(),
      });
    }
  }

  if (missingIds.size > 0) {
    log('⚠️', `Created ${missingIds.size} placeholder stages for ${[...missingIds].reduce((sum, id) => {
      return sum + rawBusinesses.filter(b => b.stageId === id).length;
    }, 0)} deals with missing stageIds`);
  }

  return rows;
}

/**
 * 6. CONTACTS (from leads)
 */
function prepareContacts(rawLeads, orgId) {
  return rawLeads.map(lead => {
    // Extract metrics
    const metrics = lead.metrics || {};

    // Build address JSONB
    const addr = lead.address || {};

    // Build metadata with ALL extra fields
    const metadata = {
      datacrazy_raw_phone: lead.rawPhone || null,
      datacrazy_rating: lead.rating,
      datacrazy_image: lead.image || null,
      datacrazy_source_referral: lead.sourceReferral || null,
      datacrazy_lists: (lead.lists || []).map(l => ({ id: l.id, name: l.name })),
      datacrazy_platform_contacts: (lead.contacts || []).map(c => ({
        platform: c.platform,
        contactId: c.contactId,
        // Strip heavy nested status to keep size manageable
        hasStatus: !!c.lastContactStatus,
      })),
      datacrazy_metrics: {
        purchaseCount: metrics.purchaseCount || 0,
        averageTicket: metrics.averageTicket || 0,
        openBusinessesCount: metrics.openBusinessesCount || 0,
        lostBusinessesCount: metrics.lostBusinessesCount || 0,
        lostBusinessesTotalValue: metrics.lostBusinessesTotalValue || 0,
        purchaseFrequency: metrics.purchaseFrequency || 0,
      },
      datacrazy_tax_id: lead.taxId || null,
      datacrazy_site: lead.site || null,
    };

    return {
      id: lead.id,
      name: (lead.name || 'Sem nome').trim(),
      email: (lead.email || '').trim() || null,
      phone: (lead.phone || '').trim().replace(/\n/g, '') || null,
      company_name: lead.company || null,
      source: lead.source || null,
      notes: lead.notes || null,
      status: 'ACTIVE',
      stage: 'LEAD',
      birth_date: lead.birthDate ? lead.birthDate.split('T')[0] : null,
      total_value: metrics.totalSpent || 0,
      last_purchase_date: metrics.lastPurchaseDate ? metrics.lastPurchaseDate.split('T')[0] : null,
      instagram: lead.instagram || null,
      tax_id: lead.taxId || null,
      website: lead.site || null,
      raw_phone: lead.rawPhone || null,
      address: Object.keys(addr).length > 0 ? addr : {},
      metadata: metadata,
      datacrazy_id: lead.id,
      organization_id: orgId,
      created_at: lead.createdAt,
      updated_at: lead.createdAt,
    };
  });
}

/**
 * 7. CONTACT_TAGS (junction from lead.tags[])
 */
function prepareContactTags(rawLeads) {
  const rows = [];
  const seen = new Set();

  for (const lead of rawLeads) {
    if (!lead.tags || lead.tags.length === 0) continue;
    for (const tag of lead.tags) {
      const key = `${lead.id}:${tag.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({
        contact_id: lead.id,
        tag_id: tag.id,
      });
    }
  }
  return rows;
}

/**
 * 8. DEALS (from businesses)
 * Builds a loss_reasons lookup map for name resolution.
 */
function prepareDeals(rawBusinesses, rawLeads, rawLossReasons, rawStages, orgId) {
  // Build lookup maps
  const lossReasonMap = {};
  for (const r of rawLossReasons) {
    lossReasonMap[r.id] = r.name.trim();
  }

  // Build lead name map for title generation
  const leadNameMap = {};
  for (const l of rawLeads) {
    leadNameMap[l.id] = (l.name || 'Sem nome').trim();
  }

  // Build stage→board map (including placeholder stages for missing refs)
  const stageBoardMap = {};
  const firstBoardId = Object.keys(rawStages)[0];
  for (const [boardId, stages] of Object.entries(rawStages)) {
    for (const s of stages) {
      stageBoardMap[s.id] = boardId;
    }
  }
  // Map missing stageIds to first board
  for (const biz of rawBusinesses) {
    if (biz.stageId && !(biz.stageId in stageBoardMap)) {
      stageBoardMap[biz.stageId] = firstBoardId;
    }
  }

  return rawBusinesses.map(biz => {
    const isWon = biz.status === 'won';
    const isLost = biz.status === 'lost';
    const leadName = leadNameMap[biz.leadId] || 'Deal';

    // Generate title: "#CODE - LeadName" or "LeadName" if no code
    const title = biz.code
      ? `#${biz.code} - ${leadName}`
      : leadName;

    // Determine board_id from stage
    const boardId = stageBoardMap[biz.stageId] || null;

    // Loss reason
    const lossReasonName = biz.lossReasonId ? (lossReasonMap[biz.lossReasonId] || null) : null;

    // Custom fields for extra data
    const customFields = {
      datacrazy_code: biz.code || null,
      datacrazy_external_id: biz.externalId || null,
      datacrazy_attendant_id: biz.attendantId || null,
      datacrazy_shipping: biz.shipping || 0,
      datacrazy_shipping_type: biz.shippingType || null,
      datacrazy_coupon: biz.coupon || null,
      datacrazy_addition: biz.addition || 0,
      datacrazy_products_count: biz.productsCount || 0,
      datacrazy_required_activity: biz.requiredActivity || false,
      datacrazy_status_changed_at: biz.statusChangedAt || null,
    };

    // Extract deal tags from the embedded lead data (if present)
    const dealTags = (biz.lead?.tags || []).map(t => t.name);

    return {
      id: biz.id,
      title: title,
      value: biz.total || 0,
      probability: isWon ? 100 : (isLost ? 0 : 50),
      status: biz.status || 'open',
      priority: 'medium',
      board_id: boardId,
      stage_id: biz.stageId || null,
      contact_id: biz.leadId || null,
      is_won: isWon,
      is_lost: isLost,
      closed_at: (isWon || isLost) ? (biz.statusChangedAt || biz.lastMovedAt) : null,
      loss_reason: lossReasonName,
      loss_reason_text: biz.justification || null,
      loss_reason_id: biz.lossReasonId || null,
      discount: biz.discount || 0,
      datacrazy_id: biz.id,
      datacrazy_code: biz.code || null,
      tags: dealTags.length > 0 ? dealTags : [],
      custom_fields: customFields,
      last_stage_change_date: biz.lastMovedAt || null,
      organization_id: orgId,
      created_at: biz.createdAt,
      updated_at: biz.lastMovedAt || biz.createdAt,
    };
  });
}

/**
 * 9. DEAL_ITEMS (from business.products[])
 */
function prepareDealItems(rawBusinesses, orgId) {
  const rows = [];
  for (const biz of rawBusinesses) {
    if (!biz.products || biz.products.length === 0) continue;
    for (const item of biz.products) {
      const product = item.product || {};
      rows.push({
        deal_id: biz.id,
        product_id: product.id || null,
        name: (product.name || item.name || 'Produto').trim(),
        quantity: item.quantity || 1,
        price: item.price || 0,
        organization_id: orgId,
      });
    }
  }
  return rows;
}

/**
 * 10. ACTIVITIES
 */
function prepareActivities(rawActivities, orgId) {
  return rawActivities.map(act => {
    const lead = act.lead || {};
    const biz = act.business || {};
    const actType = act.activityType || {};

    return {
      id: act.id,
      title: (act.title || 'Atividade').trim(),
      description: [act.description, act.notes].filter(Boolean).join('\n\n').trim() || null,
      type: actType.name || 'task',
      date: act.startDate,
      end_date: act.endDate || null,
      completed: act.isCompleted || false,
      deal_id: biz.id || null,
      contact_id: lead.id || null,
      notes: act.notes || null,
      datacrazy_id: act.id,
      metadata: {
        datacrazy_attendant: act.attendant ? {
          id: act.attendant.id,
          name: act.attendant.name,
          email: act.attendant.email,
        } : null,
        datacrazy_activity_type: actType.id ? {
          id: actType.id,
          name: actType.name,
          color: actType.color,
        } : null,
        datacrazy_flow: act.flow || null,
        datacrazy_required: act.required || false,
        datacrazy_stage: act.stage || null,
      },
      organization_id: orgId,
      created_at: act.createdAt,
    };
  });
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\n${c.bold}${c.cyan}========================================${c.reset}`);
  console.log(`${c.bold}  DataCrazy → ZmobCRM Migration${c.reset}`);
  console.log(`${c.bold}${c.cyan}========================================${c.reset}\n`);

  if (DRY_RUN) {
    log('🔍', `${c.yellow}DRY-RUN mode — no data will be written${c.reset}`);
  }

  // --- Load env ---
  try {
    require('dotenv').config({ path: path.join(ROOT, '.env.local') });
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      require('dotenv').config({ path: path.join(ROOT, '.env') });
    }
  } catch {
    // dotenv might not be installed
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(`${c.red}[ERROR] Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY${c.reset}`);
    console.error(`  Set them in .env.local or export them.`);
    process.exit(1);
  }

  log('🔌', `Connecting to Supabase: ${SUPABASE_URL}`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // --- Get organization_id ---
  log('🏢', 'Fetching organization...');
  const { data: orgs, error: orgErr } = await supabase
    .from('organizations')
    .select('id, name')
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .limit(1);

  if (orgErr || !orgs || orgs.length === 0) {
    console.error(`${c.red}[ERROR] No organization found. Run setup first.${c.reset}`);
    process.exit(1);
  }

  const ORG_ID = orgs[0].id;
  log('🏢', `Organization: ${c.green}${orgs[0].name}${c.reset} (${ORG_ID})`);

  // --- Load dump files ---
  log('📂', 'Loading DataCrazy dump files...');
  const rawLeads = loadJSON('datacrazy-leads.json');
  const rawBusinesses = loadJSON('datacrazy-businesses.json');
  const rawProducts = loadJSON('datacrazy-products.json');
  const rawTags = loadJSON('datacrazy-tags.json');
  const rawPipelines = loadJSON('datacrazy-pipelines.json');
  const rawStages = loadJSON('datacrazy-pipeline-stages.json');
  const rawActivities = loadJSON('datacrazy-activities.json');
  const rawLossReasons = loadJSON('datacrazy-loss-reasons.json');

  log('📊', `Loaded: ${rawLeads.length} leads, ${rawBusinesses.length} businesses, ${rawProducts.length} products, ${rawTags.length} tags`);

  // --- Confirmation ---
  if (!FORCE && !DRY_RUN) {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise(resolve => {
      rl.question(`\n${c.yellow}Migrar ${rawLeads.length + rawBusinesses.length + rawProducts.length + rawTags.length} registros para org "${orgs[0].name}"? (y/N): ${c.reset}`, resolve);
    });
    rl.close();
    if (answer.toLowerCase() !== 'y') {
      log('⛔', 'Aborted by user.');
      process.exit(0);
    }
  }

  // --- Results tracking ---
  const results = {};
  const startTime = Date.now();

  // === MIGRATION ORDER (respecting FK constraints) ===

  const shouldRun = (entity) => !SINGLE_ENTITY || SINGLE_ENTITY === entity;

  // 1. TAGS
  if (shouldRun('tags')) {
    log('🏷️', `Migrating ${rawTags.length} tags...`);
    const tags = prepareTags(rawTags, ORG_ID);
    results.tags = await batchUpsert(supabase, 'tags', tags, 'id', 'Tags');
  }

  // 2. LOSS REASONS
  if (shouldRun('loss_reasons')) {
    log('❌', `Migrating ${rawLossReasons.length} loss reasons...`);
    const reasons = prepareLossReasons(rawLossReasons, ORG_ID);
    results.loss_reasons = await batchUpsert(supabase, 'loss_reasons', reasons, 'id', 'Loss Reasons');
  }

  // 3. PRODUCTS
  if (shouldRun('products')) {
    log('📦', `Migrating ${rawProducts.length} products...`);
    const products = prepareProducts(rawProducts, ORG_ID);
    results.products = await batchUpsert(supabase, 'products', products, 'id', 'Products');
  }

  // 4. BOARDS (Pipelines)
  if (shouldRun('boards')) {
    log('📋', `Migrating ${rawPipelines.length} boards...`);
    const boards = prepareBoards(rawPipelines, ORG_ID);
    results.boards = await batchUpsert(supabase, 'boards', boards, 'id', 'Boards');
  }

  // 5. BOARD STAGES
  if (shouldRun('stages')) {
    log('📊', `Migrating board stages...`);
    const stages = prepareBoardStages(rawStages, rawBusinesses, ORG_ID);
    log('📊', `${stages.length} board stages (incl. placeholders for missing refs)`);
    results.stages = await batchUpsert(supabase, 'board_stages', stages, 'id', 'Board Stages');
  }

  // 6. CONTACTS (from leads)
  if (shouldRun('contacts')) {
    log('👤', `Migrating ${rawLeads.length} contacts...`);
    const contacts = prepareContacts(rawLeads, ORG_ID);
    results.contacts = await batchUpsert(supabase, 'contacts', contacts, 'id', 'Contacts');
  }

  // 7. CONTACT_TAGS junction
  if (shouldRun('contact_tags')) {
    const contactTags = prepareContactTags(rawLeads);
    log('🏷️', `Migrating ${contactTags.length} contact-tag links...`);
    results.contact_tags = await batchUpsert(supabase, 'contact_tags', contactTags, 'contact_id,tag_id', 'Contact Tags');
  }

  // 8. DEALS (from businesses) — disable duplicate check trigger temporarily
  if (shouldRun('deals')) {
    log('💰', `Migrating ${rawBusinesses.length} deals...`);

    // Disable the duplicate check trigger for bulk import
    if (!DRY_RUN) {
      const { error: trigErr } = await supabase.rpc('_migration_disable_deal_trigger');
      if (trigErr) {
        log('⚠️', `Could not disable trigger: ${trigErr.message}. Proceeding with row-by-row fallback.`);
      } else {
        log('⚙️', `${c.green}Disabled check_deal_duplicate_trigger for bulk import${c.reset}`);
      }
    }

    const deals = prepareDeals(rawBusinesses, rawLeads, rawLossReasons, rawStages, ORG_ID);
    results.deals = await batchUpsert(supabase, 'deals', deals, 'id', 'Deals');

    // Re-enable trigger
    if (!DRY_RUN) {
      const { error: trigErr2 } = await supabase.rpc('_migration_enable_deal_trigger');
      if (trigErr2) {
        log('⚠️', `Could not re-enable trigger: ${trigErr2.message}. Re-enable manually!`);
      } else {
        log('⚙️', `${c.green}Re-enabled check_deal_duplicate_trigger${c.reset}`);
      }
    }
  }

  // 9. DEAL_ITEMS
  if (shouldRun('deal_items')) {
    const dealItems = prepareDealItems(rawBusinesses, ORG_ID);
    log('📋', `Migrating ${dealItems.length} deal items...`);
    results.deal_items = await batchUpsert(supabase, 'deal_items', dealItems, 'id', 'Deal Items');
  }

  // 10. ACTIVITIES
  if (shouldRun('activities')) {
    log('📅', `Migrating ${rawActivities.length} activities...`);
    const activities = prepareActivities(rawActivities, ORG_ID);
    results.activities = await batchUpsert(supabase, 'activities', activities, 'id', 'Activities');
  }

  // === RESULTS SUMMARY ===
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n${c.bold}${c.cyan}========================================${c.reset}`);
  console.log(`${c.bold}  Migration ${DRY_RUN ? 'Validation' : 'Results'}${c.reset}`);
  console.log(`${c.bold}${c.cyan}========================================${c.reset}\n`);

  let totalInserted = 0;
  let totalErrors = 0;

  for (const [entity, result] of Object.entries(results)) {
    const status = result.errors.length === 0
      ? `${c.green}OK${c.reset}`
      : `${c.yellow}${result.errors.length} errors${c.reset}`;

    console.log(`  ${entity.padEnd(15)} ${String(result.inserted).padStart(6)} inserted  ${status}`);
    totalInserted += result.inserted;
    totalErrors += result.errors.length;

    // Log errors to file
    if (result.errors.length > 0) {
      const errFile = path.join(ROOT, 'data', `migration-errors-${entity}.json`);
      fs.writeFileSync(errFile, JSON.stringify(result.errors, null, 2));
      console.log(`  ${c.dim}  → Errors saved to: ${errFile}${c.reset}`);
    }
  }

  console.log(`\n  ${'TOTAL'.padEnd(15)} ${String(totalInserted).padStart(6)} inserted  ${totalErrors} errors`);
  console.log(`  ${'TIME'.padEnd(15)} ${elapsed}s\n`);

  // --- Validation counts ---
  if (!DRY_RUN) {
    log('🔍', 'Running post-migration validation...');

    const counts = {};
    for (const table of ['tags', 'products', 'boards', 'board_stages', 'contacts', 'deals', 'deal_items', 'activities', 'loss_reasons', 'contact_tags']) {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      counts[table] = count;
    }

    console.log(`\n${c.bold}  Post-Migration Counts:${c.reset}`);
    console.log(`  ${'tags'.padEnd(15)} ${counts.tags || 0}`);
    console.log(`  ${'products'.padEnd(15)} ${counts.products || 0}`);
    console.log(`  ${'boards'.padEnd(15)} ${counts.boards || 0}`);
    console.log(`  ${'board_stages'.padEnd(15)} ${counts.board_stages || 0}`);
    console.log(`  ${'contacts'.padEnd(15)} ${counts.contacts || 0}`);
    console.log(`  ${'deals'.padEnd(15)} ${counts.deals || 0}`);
    console.log(`  ${'deal_items'.padEnd(15)} ${counts.deal_items || 0}`);
    console.log(`  ${'activities'.padEnd(15)} ${counts.activities || 0}`);
    console.log(`  ${'loss_reasons'.padEnd(15)} ${counts.loss_reasons || 0}`);
    console.log(`  ${'contact_tags'.padEnd(15)} ${counts.contact_tags || 0}`);
  }

  // --- Expected vs Actual ---
  console.log(`\n${c.bold}  Expected Counts (from dump):${c.reset}`);
  console.log(`  ${'leads→contacts'.padEnd(15)} ${rawLeads.length}`);
  console.log(`  ${'businesses→deals'.padEnd(15)} ${rawBusinesses.length}`);
  console.log(`  ${'products'.padEnd(15)} ${rawProducts.length}`);
  console.log(`  ${'tags'.padEnd(15)} ${rawTags.length}`);
  console.log(`  ${'pipelines→boards'.padEnd(15)} ${rawPipelines.length}`);
  console.log(`  ${'stages'.padEnd(15)} ${Object.values(rawStages).flat().length}`);
  console.log(`  ${'activities'.padEnd(15)} ${rawActivities.length}`);
  console.log(`  ${'loss_reasons'.padEnd(15)} ${rawLossReasons.length}`);

  console.log(`\n${c.green}${c.bold}Migration complete!${c.reset}`);
  console.log(`${c.dim}— Dara, arquitetando dados 🗄️${c.reset}\n`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`\n${c.red}[FATAL ERROR]${c.reset}`, err);
  process.exit(1);
});
