# DataCrazy → ZmobCRM Migration Guide

## Status

- [x] **Data Dump Completed** (February 8, 2026, 17:02 UTC)
- [x] **38,281 records extracted** (10.1k leads, 13.9k deals, 27 products, 37 tags)
- [x] **Schema Migration Created** (February 10, 2026) - `20260210000000_datacrazy_staging.sql`
- [x] **Migration Script Created** (February 10, 2026) - `scripts/migrate-datacrazy-to-zmobcrm.cjs`
- [x] **Run Migration** - Executed (February 10, 2026) - 52,979 rows, 0 errors, 49.5s
- [x] **Cleanup** - Temporary helper functions removed
- [ ] **Production Cutover** - Validate in app and go live

---

## 📂 Available Data

All DataCrazy data is dumped in: `/data/dumps/`

### Full Dump
- **datacrazy-complete-dump.json** (69 MB) - Everything in one file

### Individual Entity Files (also available)
- datacrazy-leads.json (10,126 records)
- datacrazy-businesses.json (13,941 records)
- datacrazy-products.json (27 records)
- datacrazy-tags.json (37 records)
- datacrazy-pipelines.json (2 records)
- datacrazy-pipeline-stages.json (15 records)
- datacrazy-activities.json (6 records)
- datacrazy-loss-reasons.json (7 records)

---

## 🗺️ Field Mapping

### Leads → Contacts

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `leads.id` | `contacts.id` | UUID |
| `leads.name` | `contacts.name` | TEXT |
| `leads.email` | `contacts.email` | TEXT |
| `leads.phone` | `contacts.phone` | TEXT |
| `leads.role` | `contacts.role` | TEXT |
| `leads.company` | `contacts.company_name` | TEXT |
| `leads.source` | `contacts.source` | TEXT |
| `leads.notes` | `contacts.notes` | TEXT |
| `leads.tags[]` | tags table (many-to-many) | Reference tags by ID |
| `leads.metrics.totalSpent` | `contacts.total_value` | NUMERIC |
| `leads.metrics.lastPurchaseDate` | `contacts.last_purchase_date` | DATE |
| `leads.metrics.purchaseCount` | Custom field or metric | Optional |
| `leads.createdAt` | `contacts.created_at` | TIMESTAMPTZ |

### Businesses → Deals

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `businesses.id` | `deals.id` | UUID |
| `businesses.leadId` | `deals.contact_id` | Foreign key to contacts |
| `businesses.stageId` | `deals.stage_id` | Map to board_stages |
| `businesses.status` | `deals.status` / `is_won` / `is_lost` | Convert enum |
| `businesses.total` | `deals.value` | NUMERIC |
| `businesses.discount` | Custom field | Optional |
| `businesses.code` | Custom field or reference | Optional |
| `businesses.products[]` | deal_items table | One row per product |
| `businesses.lossReasonId` | `deals.loss_reason` | Foreign key to loss_reasons |
| `businesses.justification` | `deals.loss_reason_text` | Notes on why lost |
| `businesses.createdAt` | `deals.created_at` | TIMESTAMPTZ |
| `businesses.lastMovedAt` | `deals.updated_at` | TIMESTAMPTZ |

### Products → Products

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `products.id` | `products.id` | UUID |
| `products.name` | `products.name` | TEXT |
| `products.id_sku` | `products.sku` | TEXT |
| `products.price` | `products.price` | NUMERIC |
| `products.createdAt` | `products.created_at` | TIMESTAMPTZ |

### Pipelines → Boards

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `pipelines.id` | `boards.id` | UUID |
| `pipelines.name` | `boards.name` | TEXT |
| `pipelines.description` | `boards.description` | TEXT |

### Pipeline Stages → Board Stages

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `stages.id` | `board_stages.id` | UUID |
| `stages.name` | `board_stages.name` | TEXT |
| `stages.color` | `board_stages.color` | TEXT (hex or tailwind class) |
| `stages.index` | `board_stages.order` | INTEGER |
| `stages.pipelineId` | `board_stages.board_id` | Foreign key |

### Tags → Tags

| DataCrazy | ZmobCRM | Notes |
|-----------|---------|-------|
| `tags.id` | `tags.id` | UUID |
| `tags.name` | `tags.name` | TEXT |
| `tags.color` | `tags.color` | TEXT (hex) |

---

## How to Run the Migration

### Prerequisites

1. Supabase project running with schema initialized
2. Environment variables set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
3. Data dumps present in `data/dumps/`

### Step 1: Apply Schema Migration

```bash
# Via Supabase CLI (if linked)
supabase db push

# Or apply directly to the database:
# Run supabase/migrations/20260210000000_datacrazy_staging.sql
```

This adds: `contact_tags` junction table, `loss_reasons` table, metadata columns on contacts/deals/activities/products.

### Step 2: Disable Duplicate Deal Trigger (temporary)

```sql
-- IMPORTANT: The check_deal_duplicate_trigger blocks bulk import
-- Disable BEFORE running migration:
ALTER TABLE deals DISABLE TRIGGER check_deal_duplicate_trigger;

-- Re-enable AFTER migration:
ALTER TABLE deals ENABLE TRIGGER check_deal_duplicate_trigger;
```

### Step 3: Run Migration Script

```bash
# Dry-run first (validates without writing)
node scripts/migrate-datacrazy-to-zmobcrm.cjs --dry-run

# Full migration (with confirmation prompt)
node scripts/migrate-datacrazy-to-zmobcrm.cjs

# Full migration (skip confirmation)
node scripts/migrate-datacrazy-to-zmobcrm.cjs --force

# Migrate single entity
node scripts/migrate-datacrazy-to-zmobcrm.cjs --entity=contacts

# Custom batch size (default: 500)
node scripts/migrate-datacrazy-to-zmobcrm.cjs --batch=200
```

### Step 4: Re-enable Triggers

```sql
ALTER TABLE deals ENABLE TRIGGER check_deal_duplicate_trigger;
```

### Step 5: Validate

The script outputs post-migration counts automatically. Compare with expected:

| Entity | Expected |
|--------|----------|
| contacts | 10,126 |
| deals | 13,941 |
| products | 27 |
| tags | 37 |
| boards | 2 |
| board_stages | 15 |
| activities | 6 |
| loss_reasons | 7 |

### Migration Order (FK-safe)

1. Tags (no deps)
2. Loss Reasons (no deps)
3. Products (no deps)
4. Boards (no deps)
5. Board Stages (depends on boards)
6. Contacts (no deps after org)
7. Contact Tags (depends on contacts + tags)
8. Deals (depends on contacts, board_stages)
9. Deal Items (depends on deals, products)
10. Activities (depends on deals, contacts)

### Idempotency

The script uses `UPSERT` with UUID primary keys preserved from DataCrazy. Safe to re-run multiple times. Failed rows are retried individually and errors logged to `data/migration-errors-{entity}.json`.

---

## 🔄 Re-running Data Export

If DataCrazy data changes and you need to re-export:

```bash
# Set your API key
export DATACRAZY_API_KEY="dc_your_key_here"

# Run the dump script
node scripts/datacrazy-dump.js

# New files will be in data/dumps/ with timestamp
```

**Note:** The script respects API rate limits (60 req/min) with exponential backoff for 429 errors.

---

## ✅ Data Validation Checklist

Before importing to production:

- [ ] All 10,126 leads present in dump
- [ ] All 13,941 deals present in dump
- [ ] No null primary IDs
- [ ] All foreign key references exist
- [ ] Date formats are ISO 8601
- [ ] Email addresses are valid (optional regex check)
- [ ] Phone numbers are consistent format
- [ ] Product prices are positive numbers
- [ ] Tags exist before linking to leads
- [ ] Pipeline stages match pipelines

---

## 🔐 Data Privacy & Security

⚠️ **Important Considerations:**
- This dump contains PII (names, emails, phone numbers)
- Limit access to authorized team members only
- Use encrypted storage
- Delete after successful migration
- Don't commit to Git (in .gitignore)
- GDPR/privacy policy compliance for customer data

---

## 🆘 Troubleshooting

### Script fails with "429: Too many requests"
→ API rate limit hit. Script will auto-retry with exponential backoff.

### Missing DATACRAZY_API_KEY
```bash
# Add to .env file or export:
export DATACRAZY_API_KEY="your_key_from_crm.datacrazy.io/config/api"
```

### Dump files are corrupted
→ Re-run the script. Files are written only when complete.

### Some leads/deals not exported
→ Check the script output for partial failures. API may have been throttled.

---

## 100% Data Preservation

All DataCrazy fields are preserved, even those without direct ZmobCRM columns:

| DataCrazy Field | Where it's stored |
|-----------------|-------------------|
| `lead.address` | `contacts.address` (JSONB) |
| `lead.instagram` | `contacts.instagram` |
| `lead.taxId` | `contacts.tax_id` |
| `lead.site` | `contacts.website` |
| `lead.rawPhone` | `contacts.raw_phone` |
| `lead.metrics.*` | `contacts.metadata.datacrazy_metrics` |
| `lead.sourceReferral` | `contacts.metadata.datacrazy_source_referral` |
| `lead.lists[]` | `contacts.metadata.datacrazy_lists` |
| `lead.contacts[]` (platforms) | `contacts.metadata.datacrazy_platform_contacts` |
| `lead.tags[]` | `contact_tags` junction table |
| `business.code` | `deals.datacrazy_code` |
| `business.discount` | `deals.discount` |
| `business.justification` | `deals.loss_reason_text` |
| `business.shipping/coupon/etc` | `deals.custom_fields` (JSONB) |
| `business.attendantId` | `deals.custom_fields.datacrazy_attendant_id` |
| `activity.attendant` | `activities.metadata` (JSONB) |
| `activity.activityType` | `activities.metadata` + `activities.type` |
| `lossReasons.*` | `loss_reasons` table |

## Schema Additions (migration 20260210000000)

- `contact_tags` table (contact_id, tag_id) - junction for lead tags
- `loss_reasons` table (id, name, requires_justification)
- `contacts`: +metadata, +instagram, +tax_id, +website, +raw_phone, +address, +datacrazy_id
- `deals`: +datacrazy_id, +datacrazy_code, +loss_reason_text, +discount, +loss_reason_id
- `activities`: +end_date, +notes, +datacrazy_id, +metadata
- `products`: +datacrazy_id, +image

## Files Created

| File | Purpose |
|------|---------|
| `supabase/migrations/20260210000000_datacrazy_staging.sql` | Schema additions for 100% data preservation |
| `scripts/migrate-datacrazy-to-zmobcrm.cjs` | Node.js migration script (idempotent, batch, error recovery) |

---

**Data Engineer:** Dara
**Last Updated:** February 10, 2026
