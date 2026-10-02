const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:5173/#buyer-dashboard ...');
  await page.goto('http://localhost:5173/#buyer-dashboard', { waitUntil: 'networkidle' });

  // Wait 2 seconds for any state/animations
  await page.waitForTimeout(2000);

  const title = await page.title();
  console.log('Page Title:', title);

  const sidebarVisible = await page.isVisible('.buyer-sidebar');
  console.log('Sidebar visible:', sidebarVisible);

  const screenshotPath = path.join(__dirname, 'buyer_dashboard_rendered.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
})();
