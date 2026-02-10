#!/usr/bin/env node

/**
 * DataCrazy Full Data Dump
 * Extrai TODOS os dados do DataCrazy API e salva em JSON para migração posterior
 *
 * Usage: node scripts/datacrazy-dump.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const API_KEY = process.env.DATACRAZY_API_KEY;
if (!API_KEY) {
  console.error('❌ Error: DATACRAZY_API_KEY environment variable is not set');
  console.error('Set it with: export DATACRAZY_API_KEY="your_api_key"');
  process.exit(1);
}
const BASE_URL = 'https://api.g1.datacrazy.io/api/v1';
const DUMP_DIR = path.join(__dirname, '../data/dumps');
const RATE_LIMIT_DELAY = 1100; // 1100ms between requests (60 req/min = 1 req/sec, being extra conservative)

// Ensure dump directory exists
if (!fs.existsSync(DUMP_DIR)) {
  fs.mkdirSync(DUMP_DIR, { recursive: true });
}

/**
 * Make API request with rate limiting and retry logic
 */
async function apiRequest(endpoint, options = {}, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add query params if provided
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, reqOptions, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', async () => {
        try {
          if (res.statusCode === 429) {
            // Rate limited - retry with exponential backoff
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
            console.log(`    ⏳ Rate limited, retrying in ${retryDelay}ms (attempt ${retryCount + 1})`);
            await sleep(retryDelay);
            return resolve(await apiRequest(endpoint, options, retryCount + 1));
          }

          if (res.statusCode >= 400) {
            reject(new Error(`API Error ${res.statusCode}: ${data}`));
          }
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

/**
 * Sleep for ms milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch paginated data
 */
async function fetchPaginated(endpoint, options = {}) {
  let allData = [];
  let skip = 0;
  const take = options.take || 100;
  let hasMore = true;

  while (hasMore) {
    try {
      console.log(`  Fetching ${endpoint}... (skip: ${skip}, take: ${take})`);

      const params = {
        skip: skip.toString(),
        take: take.toString(),
        ...options.params,
      };

      const response = await apiRequest(endpoint, { params });

      if (response.data && Array.isArray(response.data)) {
        allData = allData.concat(response.data);

        if (response.data.length < take) {
          hasMore = false;
        } else {
          skip += take;
        }

        console.log(`    ✓ Got ${response.data.length} items (total: ${allData.length})`);
      } else {
        hasMore = false;
      }

      // Respect rate limits
      await sleep(RATE_LIMIT_DELAY);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      throw error;
    }
  }

  return allData;
}

/**
 * Fetch single item
 */
async function fetchSingle(endpoint) {
  try {
    const response = await apiRequest(endpoint);
    await sleep(RATE_LIMIT_DELAY);
    return response;
  } catch (error) {
    console.error(`  ✗ Error fetching ${endpoint}: ${error.message}`);
    throw error;
  }
}

/**
 * Save data to file
 */
function saveToFile(filename, data) {
  const filepath = path.join(DUMP_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✓ Saved to ${filename}`);
}

/**
 * Main dump function
 */
async function dumpAllData() {
  console.log('🗄️ DataCrazy Full Data Dump');
  console.log(`📁 Output directory: ${DUMP_DIR}`);
  console.log('⏳ Starting extraction...\n');

  const startTime = Date.now();
  const dump = {
    exportedAt: new Date().toISOString(),
    data: {},
  };

  try {
    // 1. Fetch Tags (37 items)
    console.log('1️⃣ Extracting Tags...');
    dump.data.tags = await fetchPaginated('/tags');
    console.log(`   Total: ${dump.data.tags.length} tags\n`);

    // 2. Fetch Products (27 items)
    console.log('2️⃣ Extracting Products...');
    dump.data.products = await fetchPaginated('/products');
    console.log(`   Total: ${dump.data.products.length} products\n`);

    // 3. Fetch Pipelines (2 items)
    console.log('3️⃣ Extracting Pipelines...');
    dump.data.pipelines = await fetchPaginated('/pipelines');
    console.log(`   Total: ${dump.data.pipelines.length} pipelines\n`);

    // 4. Fetch Pipeline Stages (for each pipeline)
    console.log('4️⃣ Extracting Pipeline Stages...');
    dump.data.pipelineStages = {};
    for (const pipeline of dump.data.pipelines) {
      console.log(`   Fetching stages for pipeline: ${pipeline.name} (${pipeline.id})`);
      const stages = await fetchPaginated(`/pipelines/${pipeline.id}/stages`);
      dump.data.pipelineStages[pipeline.id] = stages;
      console.log(`   ✓ Got ${stages.length} stages\n`);
    }

    // 5. Fetch Loss Reasons
    console.log('5️⃣ Extracting Loss Reasons...');
    dump.data.lossReasons = await fetchPaginated('/business-loss-reasons');
    console.log(`   Total: ${dump.data.lossReasons.length} loss reasons\n`);

    // 6. Fetch Leads (10.126 items) - THIS IS THE BIG ONE
    console.log('6️⃣ Extracting Leads (THIS WILL TAKE A WHILE)...');
    console.log('   This is 10,126 leads at 100 per page = ~102 requests...');
    dump.data.leads = await fetchPaginated('/leads', { take: 100 });
    console.log(`   ✓ Total: ${dump.data.leads.length} leads\n`);

    // 7. Fetch Businesses (Deals)
    console.log('7️⃣ Extracting Businesses (Deals)...');
    dump.data.businesses = await fetchPaginated('/businesses', { take: 100 });
    console.log(`   Total: ${dump.data.businesses.length} businesses\n`);

    // 8. Fetch Activities
    console.log('8️⃣ Extracting Activities...');
    dump.data.activities = await fetchPaginated('/activities', { take: 100 });
    console.log(`   Total: ${dump.data.activities.length} activities\n`);

    // Save main dump
    console.log('💾 Saving complete dump...');
    saveToFile('datacrazy-complete-dump.json', dump);

    // Save individual entity files for easier processing
    console.log('\n📄 Saving individual entity files...');
    saveToFile('datacrazy-leads.json', dump.data.leads);
    saveToFile('datacrazy-businesses.json', dump.data.businesses);
    saveToFile('datacrazy-products.json', dump.data.products);
    saveToFile('datacrazy-tags.json', dump.data.tags);
    saveToFile('datacrazy-pipelines.json', dump.data.pipelines);
    saveToFile('datacrazy-pipeline-stages.json', dump.data.pipelineStages);
    saveToFile('datacrazy-activities.json', dump.data.activities);
    saveToFile('datacrazy-loss-reasons.json', dump.data.lossReasons);

    // Generate summary report
    const summary = {
      exportedAt: dump.exportedAt,
      summary: {
        leads: dump.data.leads.length,
        businesses: dump.data.businesses.length,
        products: dump.data.products.length,
        tags: dump.data.tags.length,
        pipelines: dump.data.pipelines.length,
        activities: dump.data.activities.length,
        lossReasons: dump.data.lossReasons.length,
      },
      files: {
        complete: 'datacrazy-complete-dump.json',
        entities: [
          'datacrazy-leads.json',
          'datacrazy-businesses.json',
          'datacrazy-products.json',
          'datacrazy-tags.json',
          'datacrazy-pipelines.json',
          'datacrazy-pipeline-stages.json',
          'datacrazy-activities.json',
          'datacrazy-loss-reasons.json',
        ],
      },
      dumpDirectory: DUMP_DIR,
    };

    saveToFile('datacrazy-dump-summary.json', summary);

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n✅ DUMP COMPLETE!');
    console.log('═'.repeat(50));
    console.log('📊 SUMMARY:');
    console.log(`   Leads: ${summary.summary.leads}`);
    console.log(`   Businesses: ${summary.summary.businesses}`);
    console.log(`   Products: ${summary.summary.products}`);
    console.log(`   Tags: ${summary.summary.tags}`);
    console.log(`   Pipelines: ${summary.summary.pipelines}`);
    console.log(`   Activities: ${summary.summary.activities}`);
    console.log(`   Loss Reasons: ${summary.summary.lossReasons}`);
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📁 Location: ${DUMP_DIR}`);
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('\n❌ DUMP FAILED!');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run
dumpAllData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
