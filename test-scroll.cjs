const { chromium } = require('playwright-core');

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

  await page.goto('http://localhost:5173/#buyer-dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Initial State
  const initialSidebar = await page.$eval('.buyer-sidebar', el => {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  });
  const initialScrollTop = await page.$eval('.buyer-main-viewport', el => el.scrollTop);
  console.log('INITIAL SIDEBAR RECT:', initialSidebar);
  console.log('INITIAL VIEWPORT SCROLLTOP:', initialScrollTop);

  // 2. Scroll the main viewport down by 700px
  await page.$eval('.buyer-main-viewport', el => el.scrollTo({ top: 700, behavior: 'instant' }));
  await page.waitForTimeout(600);

  // 3. Measure after scroll
  const afterSidebar = await page.$eval('.buyer-sidebar', el => {
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  });
  const afterScrollTop = await page.$eval('.buyer-main-viewport', el => el.scrollTop);
  console.log('AFTER SCROLL SIDEBAR RECT:', afterSidebar);
  console.log('AFTER SCROLL VIEWPORT SCROLLTOP:', afterScrollTop);

  // Verify sticky behavior
  const isSidebarSticky = (initialSidebar.top === afterSidebar.top) && (initialSidebar.left === afterSidebar.left);
  const isContentScrolled = afterScrollTop > 0;

  console.log('TEST RESULT:');
  console.log('- Is Left Navbar 100% Sticky/Stationary?:', isSidebarSticky);
  console.log('- Is Content Successfully Scrolled?:', isContentScrolled);

  // Take screenshot while scrolled
  await page.screenshot({ path: 'd:\\mini project\\scrolled_dashboard.png' });
  console.log('Saved screenshot to d:\\mini project\\scrolled_dashboard.png');

  await browser.close();
})();
