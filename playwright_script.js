import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runTest() {
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();

  // Set viewport to ensure buttons are visible
  await page.setViewportSize({ width: 1280, height: 720 });

  // Navigate to the URL
  console.log('Opening https://zcrm-three.vercel.app/inbox...');
  await page.goto('https://zcrm-three.vercel.app/inbox', { waitUntil: 'networkidle' });

  console.log('Waiting for page to load completely...');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Additional wait for any animations

  // Look for the Foco tab and click it
  console.log('Looking for Foco tab...');
  const focoButton = page.locator('text=Foco');

  if (await focoButton.count() > 0) {
    console.log('Found Foco button, clicking it...');
    await focoButton.first().click();
    await page.waitForTimeout(1000); // Wait for tab to switch
  } else {
    console.log('Foco button not found via text search, trying alternative selectors...');
    // Try to find by role or other selectors
    const buttons = await page.locator('button').all();
    let found = false;
    for (const button of buttons) {
      const text = await button.textContent();
      if (text && text.includes('Foco')) {
        await button.click();
        found = true;
        console.log('Clicked Foco button');
        break;
      }
    }
    if (!found) {
      console.log('Warning: Could not find Foco tab');
    }
  }

  // Wait a bit for the view to render
  await page.waitForTimeout(1500);

  // Take screenshot
  const screenshotDir = '/tmp';
  const screenshotPath = path.join(screenshotDir, `foco_tab_${Date.now()}.png`);

  console.log(`Taking screenshot and saving to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();

  console.log(`Screenshot saved: ${screenshotPath}`);
  return screenshotPath;
}

runTest().then(path => {
  console.log(path);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
