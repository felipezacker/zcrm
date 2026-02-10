#!/usr/bin/env node
/**
 * Validates DataCrazy dump data integrity before migration.
 */
const fs = require('fs');
const path = require('path');
const DUMPS = path.join(__dirname, '..', 'data', 'dumps');

function load(f) { return JSON.parse(fs.readFileSync(path.join(DUMPS, f), 'utf-8')); }

const leads = load('datacrazy-leads.json');
const businesses = load('datacrazy-businesses.json');
const products = load('datacrazy-products.json');
const tags = load('datacrazy-tags.json');
const pipelines = load('datacrazy-pipelines.json');
const stages = load('datacrazy-pipeline-stages.json');
const activities = load('datacrazy-activities.json');
const lossReasons = load('datacrazy-loss-reasons.json');

// --- CONTACTS ---
let withTags = 0, withEmail = 0, withPhone = 0, withBirthDate = 0, withNotes = 0;
for (const l of leads) {
  if (l.tags && l.tags.length > 0) withTags++;
  if (l.email) withEmail++;
  if (l.phone) withPhone++;
  if (l.birthDate) withBirthDate++;
  if (l.notes) withNotes++;
}
console.log('=== CONTACTS (from leads) ===');
console.log('  Total:', leads.length);
console.log('  With tags:', withTags);
console.log('  With email:', withEmail);
console.log('  With phone:', withPhone);
console.log('  With birthDate:', withBirthDate);
console.log('  With notes:', withNotes);

// --- DEALS ---
let wonDeals = 0, lostDeals = 0, openDeals = 0, withProducts = 0, totalDealItems = 0, withLossReason = 0;
for (const b of businesses) {
  if (b.status === 'won') wonDeals++;
  else if (b.status === 'lost') lostDeals++;
  else openDeals++;
  if (b.products && b.products.length > 0) { withProducts++; totalDealItems += b.products.length; }
  if (b.lossReasonId) withLossReason++;
}
console.log('\n=== DEALS (from businesses) ===');
console.log('  Total:', businesses.length);
console.log('  Won:', wonDeals);
console.log('  Lost:', lostDeals);
console.log('  Open:', openDeals);
console.log('  With products:', withProducts, '=>', totalDealItems, 'deal items');
console.log('  With loss reason:', withLossReason);

// FK validation
const leadIds = new Set(leads.map(l => l.id));
let missingLeads = 0;
for (const b of businesses) {
  if (b.leadId && !(leadIds.has(b.leadId))) missingLeads++;
}
console.log('  Missing leadId refs:', missingLeads);

const stageIds = new Set(Object.values(stages).flat().map(s => s.id));
let missingStages = 0;
for (const b of businesses) {
  if (b.stageId && !(stageIds.has(b.stageId))) missingStages++;
}
console.log('  Missing stageId refs:', missingStages);

// Product refs
const productIds = new Set(products.map(p => p.id));
let missingProducts = 0;
for (const b of businesses) {
  for (const item of (b.products || [])) {
    const pid = item.product ? item.product.id : null;
    if (pid && !(productIds.has(pid))) missingProducts++;
  }
}
console.log('  Missing product refs:', missingProducts);

// Loss reason refs
const lrIds = new Set(lossReasons.map(r => r.id));
let missingLR = 0;
for (const b of businesses) {
  if (b.lossReasonId && !(lrIds.has(b.lossReasonId))) missingLR++;
}
console.log('  Missing lossReason refs:', missingLR);

// --- CONTACT TAGS ---
let totalContactTags = 0;
const seen = new Set();
for (const l of leads) {
  for (const t of (l.tags || [])) {
    const k = l.id + ':' + t.id;
    if (!(seen.has(k))) { totalContactTags++; seen.add(k); }
  }
}
console.log('\n=== JUNCTION: contact_tags ===');
console.log('  Total unique links:', totalContactTags);

// --- ACTIVITIES ---
console.log('\n=== ACTIVITIES ===');
console.log('  Total:', activities.length);
let actWithDeal = 0, actWithLead = 0;
for (const a of activities) {
  if (a.business) actWithDeal++;
  if (a.lead) actWithLead++;
}
console.log('  With deal:', actWithDeal);
console.log('  With contact:', actWithLead);

// --- SUMMARY ---
console.log('\n=== TOTAL RECORDS TO MIGRATE ===');
const allStages = Object.values(stages).flat();
const total = leads.length + businesses.length + products.length + tags.length + pipelines.length + allStages.length + activities.length + lossReasons.length + totalDealItems + totalContactTags;
console.log('  Tags:', tags.length);
console.log('  Loss Reasons:', lossReasons.length);
console.log('  Products:', products.length);
console.log('  Boards:', pipelines.length);
console.log('  Board Stages:', allStages.length);
console.log('  Contacts:', leads.length);
console.log('  Contact Tags:', totalContactTags);
console.log('  Deals:', businesses.length);
console.log('  Deal Items:', totalDealItems);
console.log('  Activities:', activities.length);
console.log('  ---------');
console.log('  TOTAL:', total, 'rows to insert');

const hasErrors = missingLeads > 0 || missingStages > 0 || missingProducts > 0 || missingLR > 0;
console.log(hasErrors ? '\n[WARN] Some FK references missing - check above' : '\n[OK] All validations passed!');
process.exit(hasErrors ? 1 : 0);
