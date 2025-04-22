const puppeteer = require('puppeteer');
const config = require('./config');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.goto('https://www.linkedin.com/login');
  console.log("Log in manually. Waiting...");
  await page.waitForTimeout(config.loginWaitTime);

  await page.goto(config.jobSearchUrl, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.jobs-search-results__list-item');

  const jobLinks = await page.$$eval('.jobs-search-results__list-item a.job-card-list__title', links =>
    links.map(link => link.href)
  );

  console.log(`Found ${jobLinks.length} jobs.`);

  for (let i = 0; i < Math.min(config.jobsToApply, jobLinks.length); i++) {
    const jobUrl = jobLinks[i];
    console.log(`\n[${i + 1}] Opening job: ${jobUrl}`);
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });

    try {
      await page.waitForSelector('button.jobs-apply-button', { timeout: 5000 });
      await page.click('button.jobs-apply-button');
      await page.waitForTimeout(2000);

      const phoneInput = await page.$('input[aria-label="Phone number"]');
      if (phoneInput) {
        await phoneInput.click({ clickCount: 3 });
        await phoneInput.type(config.phone);
      }

      const [fileChooser] = await Promise.all([
        page.waitForFileChooser().catch(() => null),
        page.click('input[type="file"], button[aria-label*="Upload"]', { delay: 500 }).catch(() => null)
      ]);
      if (fileChooser) {
        await fileChooser.accept([config.resumePath]);
        console.log("Uploaded resume");
      }

      const submitBtn = await page.$('button[aria-label*="Submit application"]');
      if (submitBtn) {
        await submitBtn.click();
        console.log("Submitted application!");
        await page.waitForTimeout(2000);
      } else {
        console.log("Multi-step form detected. Skipping.");
        await page.click('button[aria-label="Dismiss"]');
      }

    } catch (err) {
      console.log("Easy Apply failed or not available for this job.");
    }

    await page.waitForTimeout(2000);
  }

  console.log("Done.");
  await browser.close();
})();
