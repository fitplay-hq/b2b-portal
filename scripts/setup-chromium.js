const chromium = require('@sparticuz/chromium');

(async () => {
  try {
    await chromium.executablePath();
    console.log('✅ Chromium binaries ready');
  } catch (error) {
    console.error('❌ Chromium setup failed:', error);
  }
})();