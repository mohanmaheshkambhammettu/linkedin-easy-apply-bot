# LinkedIn Easy Apply Bot

A simple LinkedIn automation script using Puppeteer to apply for Easy Apply jobs automatically.

## Features

- Logs in manually to avoid detection
- Applies to `Easy Apply` jobs
- Uploads your resume
- Fills phone number
- Submits if it's a 1-step form

## Getting Started

### 1. Clone or download
```bash
git clone https://github.com/yourusername/linkedin-easy-apply-bot.git
cd linkedin-easy-apply-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set your config

Edit `config.js`:
```js
module.exports = {
  phone: 'your-phone-number',
  resumePath: '/absolute/path/to/your/resume.pdf',
  jobSearchUrl: 'https://www.linkedin.com/jobs/search/?keywords=software%20engineer&f_AL=true',
  jobsToApply: 5,
  loginWaitTime: 30000
};
```

### 4. Run the bot
```bash
node easyApplyBot.js
```

> Log in manually when the browser opens, then the bot will begin applying.

## Disclaimer

- For personal use only.
- Violates LinkedIn’s Terms of Service.
- Use at your own risk.
