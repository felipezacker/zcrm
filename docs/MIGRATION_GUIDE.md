# DataCrazy → ZmobCRM Migration Guide

## 📋 Status

- ✅ **Data Dump Completed** (February 8, 2026, 17:02 UTC)
- ✅ **38,281 records extracted** (10.1k leads, 13.9k deals, 27 products, 37 tags)
- ⏳ **Staging & Migration** - In Planning
- ⏳ **Production Cutover** - To be scheduled

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

## 🚀 Migration Strategies

### Strategy 1: Bulk Insert via SQL (Fastest)
1. Create staging tables
2. COPY data from JSON to staging
3. Transform and validate
4. Move to production tables

### Strategy 2: API-based (Safest)
1. Create Supabase functions to process each entity
2. Insert via REST API with RLS enforcement
3. Real-time validation

### Strategy 3: Hybrid (Recommended)
1. Bulk insert to staging
2. Validate with SQL checks
3. Move to production with functions

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

## 📞 Next Steps

1. **Data Validation** - Review dump files for completeness
2. **Schema Design** - Finalize ZmobCRM schema if needed
3. **Staging Setup** - Create staging tables in Supabase
4. **Migration Script** - Develop entity-by-entity import
5. **Testing** - Full migration test run
6. **Production Cutover** - Schedule and execute
7. **Verification** - Validate all data in ZmobCRM
8. **Archive** - Delete DataCrazy dump files

---

**Data Engineer:** Dara 🗄️
**Last Updated:** February 8, 2026
