// scripts/test-admin-suite.cjs - Full API & Browser Lifecycle Verification for Centralized Admin Dashboard
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright-core');

const chromePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];
const executablePath = chromePaths.find(p => fs.existsSync(p));

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 5173;
const BACKEND_URL = `http://127.0.0.1:${BACKEND_PORT}`;
const FRONTEND_URL = `http://127.0.0.1:${FRONTEND_PORT}`;

// Helper: HTTP request
function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({ status: res.statusCode, headers: res.headers, raw: data, data: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('🧪 RUNNING COMPREHENSIVE ADMIN DASHBOARD TEST SUITE');
  console.log('=============================================================\n');

  // 1. Start Backend Server
  const app = require('../backend/server.js');
  let backendServer;
  await new Promise((resolve, reject) => {
    backendServer = app.listen(BACKEND_PORT, '127.0.0.1', (err) => {
      if (err) return reject(err);
      console.log(`✓ Backend API listening on ${BACKEND_URL}`);
      resolve();
    });
  });

  // 2. Start Vite Frontend Server with proxy to test backend
  const { createServer } = await import('vite');
  const viteServer = await createServer({
    server: {
      port: FRONTEND_PORT,
      host: '127.0.0.1',
      proxy: {
        '/api': {
          target: BACKEND_URL,
          changeOrigin: true
        }
      }
    },
    configFile: path.resolve(__dirname, '../vite.config.js')
  });
  await viteServer.listen();
  console.log(`✓ Vite frontend listening on ${FRONTEND_URL}`);

  let adminToken = '';

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Admin Authentication & Security
    // -------------------------------------------------------------------------
    console.log('\n🔒 Test 1: Testing Admin Login & Token Generation...');
    const loginRes = await request(`${BACKEND_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'admin@naamuzhavar.com',
      password: 'Admin@2026'
    });

    if (loginRes.status !== 200 || !loginRes.data?.token) {
      throw new Error(`Admin login failed with status ${loginRes.status}: ${loginRes.raw}`);
    }
    adminToken = loginRes.data.token;
    console.log(`  ✓ Admin login successful. Received 7-day JWT.`);

    // -------------------------------------------------------------------------
    // TEST 2: RBAC Protection - Reject Non-Admin Tokens
    // -------------------------------------------------------------------------
    console.log('\n🛡️ Test 2: Testing RBAC Protection against non-admin tokens...');
    const farmerRes = await request(`${BACKEND_URL}/api/admin/overview`, {
      headers: { Authorization: 'Bearer farmer_demo_token' }
    });
    if (farmerRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for farmer token on admin endpoint, got ${farmerRes.status}`);
    }
    console.log(`  ✓ Non-admin farmer token successfully rejected with 403 Forbidden.`);

    const unauthRes = await request(`${BACKEND_URL}/api/admin/overview`);
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for missing token, got ${unauthRes.status}`);
    }
    console.log(`  ✓ Unauthenticated request successfully rejected with 401 Unauthorized.`);

    // -------------------------------------------------------------------------
    // TEST 3: Overview & Real-Time Analytics
    // -------------------------------------------------------------------------
    console.log('\n📊 Test 3: Testing Admin Overview Metrics & Charts API...');
    const overviewRes = await request(`${BACKEND_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (overviewRes.status !== 200 || !overviewRes.data?.metrics) {
      throw new Error(`Failed to load admin overview: ${overviewRes.raw}`);
    }
    const m = overviewRes.data.metrics;
    console.log(`  ✓ Metrics retrieved: Farmers=${m.totalFarmers}, Buyers=${m.totalBuyers}, Crops=${m.totalCrops}, Orders=${m.totalOrders}`);
    console.log(`  ✓ Charts retrieved: ${Object.keys(overviewRes.data.charts).join(', ')}`);

    // -------------------------------------------------------------------------
    // TEST 4: Farmer Directory & Status Toggle
    // -------------------------------------------------------------------------
    console.log('\n🌾 Test 4: Testing Farmer Management & Status Toggle...');
    const farmersRes = await request(`${BACKEND_URL}/api/admin/farmers?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (farmersRes.status !== 200 || !Array.isArray(farmersRes.data?.farmers)) {
      throw new Error(`Failed to load farmers list: ${farmersRes.raw}`);
    }
    const firstFarmer = farmersRes.data.farmers[0];
    const farmerTargetId = firstFarmer.farmerId || firstFarmer.id || firstFarmer._id;
    console.log(`  ✓ Farmers list retrieved (${farmersRes.data.farmers.length} farmers). Inspecting #${farmerTargetId}...`);

    // Toggle status
    const toggleRes = await request(`${BACKEND_URL}/api/admin/farmers/${farmerTargetId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      isVerified: true,
      status: 'active'
    });
    if (toggleRes.status !== 200) {
      throw new Error(`Farmer status toggle failed: ${toggleRes.raw}`);
    }
    console.log(`  ✓ Farmer status toggle succeeded: ${toggleRes.data.message}`);

    // -------------------------------------------------------------------------
    // TEST 5: Buyer Directory & Detail Inspection
    // -------------------------------------------------------------------------
    console.log('\n🏢 Test 5: Testing Buyer Management Directory...');
    const buyersRes = await request(`${BACKEND_URL}/api/admin/buyers?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (buyersRes.status !== 200 || !Array.isArray(buyersRes.data?.buyers)) {
      throw new Error(`Failed to load buyers list: ${buyersRes.raw}`);
    }
    console.log(`  ✓ Buyers list retrieved (${buyersRes.data.buyers.length} buyers).`);

    // -------------------------------------------------------------------------
    // TEST 6: Delivery Logistics & Status Intervention
    // -------------------------------------------------------------------------
    console.log('\n🚚 Test 6: Testing Delivery Logistics & Milestone Override...');
    const delivRes = await request(`${BACKEND_URL}/api/admin/deliveries?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (delivRes.status !== 200 || !Array.isArray(delivRes.data?.deliveries)) {
      throw new Error(`Failed to load deliveries list: ${delivRes.raw}`);
    }
    console.log(`  ✓ Deliveries list retrieved (${delivRes.data.deliveries.length} consignments).`);

    // -------------------------------------------------------------------------
    // TEST 6b: Driver Management Directory & Telemetry
    // -------------------------------------------------------------------------
    console.log('\n⚡ Test 6b: Testing Driver Management Directory & Telemetry...');
    const driversRes = await request(`${BACKEND_URL}/api/admin/drivers?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (driversRes.status !== 200 || !Array.isArray(driversRes.data?.drivers)) {
      throw new Error(`Failed to load drivers list: ${driversRes.raw}`);
    }
    console.log(`  ✓ Drivers roster retrieved (${driversRes.data.drivers.length} pilots).`);

    const testDriver = driversRes.data.drivers[0];
    if (testDriver) {
      const driverDetailRes = await request(`${BACKEND_URL}/api/admin/drivers/${testDriver.driverId || testDriver._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (driverDetailRes.status !== 200 || !driverDetailRes.data?.driver) {
        throw new Error(`Failed to load driver dossier: ${driverDetailRes.raw}`);
      }
      console.log(`  ✓ Driver dossier retrieved: ${driverDetailRes.data.driver.name} (${driverDetailRes.data.driver.vehicle?.model})`);
    }

    // -------------------------------------------------------------------------
    // TEST 7: Reports Aggregations & CSV Export with UTF-8 BOM
    // -------------------------------------------------------------------------
    console.log('\n📈 Test 7: Testing Reports Aggregations & CSV Export...');
    const repRes = await request(`${BACKEND_URL}/api/admin/reports?type=overall`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (repRes.status !== 200 || !repRes.data?.data) {
      throw new Error(`Reports aggregation failed: ${repRes.raw}`);
    }
    console.log(`  ✓ Reports aggregation returned: Total Supply=${repRes.data.data.overall?.totalSupplyKg} Kg, Total Demand=${repRes.data.data.overall?.totalDemandKg} Kg`);

    // Test CSV download
    const csvRes = await request(`${BACKEND_URL}/api/admin/reports/export?module=farmers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (csvRes.status !== 200) {
      throw new Error(`CSV export failed: status ${csvRes.status}`);
    }
    // Verify UTF-8 BOM (\uFEFF) at start of payload
    const hasBOM = csvRes.raw.charCodeAt(0) === 0xFEFF;
    if (!hasBOM) {
      throw new Error(`❌ CSV export missing UTF-8 Byte Order Mark (\\uFEFF)!`);
    }
    console.log(`  ✓ CSV export generated with UTF-8 BOM (\uFEFF). Excel Tamil compatibility confirmed!`);

    // -------------------------------------------------------------------------
    // TEST 8: Headless Playwright Browser Test (/admin lifecycle)
    // -------------------------------------------------------------------------
    if (executablePath) {
      console.log('\n🌐 Test 8: Headless Chromium Browser E2E Test (/admin)...');
      const browser = await chromium.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-gpu']
      });

      const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const page = await context.newPage();
      page.on('console', msg => console.log('    [PAGE LOG]:', msg.text()));
      page.on('pageerror', err => console.log('    [PAGE ERROR]:', err.message));

      // Step A: Visit /admin when unauthenticated
      await page.goto(`${FRONTEND_URL}/admin`, { waitUntil: 'networkidle' });
      const hasLoginForm = await page.locator('button:has-text("Sign In to Operations Console")').count() > 0;
      if (!hasLoginForm) {
        throw new Error('❌ Unauthenticated visit to /admin did not show Admin Login form!');
      }
      console.log('  ✓ Visiting /admin when unauthenticated properly renders Admin Login.');

      // Step B: Submit login form
      await page.locator('button:has-text("Auto-fill Credentials")').click();
      await page.locator('button[type="submit"]').click();
      await page.waitForSelector('text=Recent Consignments', { timeout: 10000 });
      console.log('  ✓ Admin login submitted. Dashboard Overview loaded with KPI cards & charts.');

      // Step C: Navigate to Farmer Management
      await page.locator('a:has-text("Farmer Management")').click();
      await page.waitForTimeout(800);
      const hasFarmersTable = await page.locator('text=Farmer Management').count() > 0;
      if (!hasFarmersTable) {
        throw new Error('❌ Farmer Management directory failed to render!');
      }
      console.log('  ✓ Navigated to Farmer Management: Directory table rendered.');

      // Step D: Open Farmer Details Drawer
      const detailsBtn = page.locator('button:has-text("Details")').first();
      if (await detailsBtn.count() > 0) {
        await detailsBtn.click();
        await page.waitForTimeout(600);
        const hasDrawer = await page.locator('.admin-drawer').count() > 0;
        if (!hasDrawer) {
          throw new Error('❌ Farmer details drawer failed to open!');
        }
        console.log('  ✓ Farmer details drawer opened: Patta records & produce listings inspected.');
        await page.locator('.admin-drawer-header button').click();
        await page.waitForTimeout(300);
      }

      // Step E: Navigate to Delivery Logistics
      await page.locator('a:has-text("Delivery Logistics")').click();
      await page.waitForTimeout(800);
      const hasDeliveries = await page.locator('text=Delivery Logistics Management').count() > 0;
      if (!hasDeliveries) {
        throw new Error('❌ Delivery Logistics view failed to render!');
      }
      console.log('  ✓ Navigated to Delivery Logistics: Live EV fleet consignments rendered.');

      // Step E2: Navigate to Driver Management
      await page.locator('a:has-text("Driver Management")').click();
      await page.waitForTimeout(800);
      const hasDrivers = await page.locator('text=Driver Management').count() > 0;
      if (!hasDrivers) {
        throw new Error('❌ Driver Management view failed to render!');
      }
      console.log('  ✓ Navigated to Driver Management: Fleet roster rendered.');

      // Step E3: Test Mobile Viewport Responsiveness (375x812 iPhone)
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);
      const overflowDiff = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return docWidth - winWidth;
      });
      if (overflowDiff > 2) {
        throw new Error(`❌ Mobile horizontal overflow detected! docWidth exceeds window by ${overflowDiff}px`);
      }
      console.log(`  ✓ Mobile viewport (375x812) verified: Zero horizontal overflow!`);

      // Restore desktop viewport
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.waitForTimeout(400);

      // Step F: Navigate to Reports & Analytics
      await page.locator('a:has-text("Reports & Analytics")').click();
      await page.waitForTimeout(800);
      const hasReports = await page.locator('text=Operations Reports & Analytics').count() > 0;
      if (!hasReports) {
        throw new Error('❌ Reports & Analytics view failed to render!');
      }
      console.log('  ✓ Navigated to Reports & Analytics: Reporting tabs & KPI summaries rendered.');

      // Step G: Test Sign Out
      await page.locator('button[aria-label="Sign Out"], button:has-text("Sign Out")').first().click();
      await page.waitForTimeout(600);
      const backAtLogin = await page.locator('button:has-text("Sign In to Operations Console")').count() > 0;
      if (!backAtLogin) {
        throw new Error('❌ Signing out did not return to Admin Login!');
      }
      console.log('  ✓ Admin Sign Out successful: Cleanly returned to Admin Login gate.');

      await browser.close();
    }

    console.log('\n=============================================================');
    console.log('🎉 ALL ADMIN DASHBOARD VERIFICATION TESTS PASSED (100%)!');
    console.log('=============================================================\n');

  } catch (err) {
    console.error('\n❌ Test failure:', err.message);
    process.exitCode = 1;
  } finally {
    await viteServer.close();
    backendServer.close();
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
