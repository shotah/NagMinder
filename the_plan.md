# **Building a Chrome "Nag" Plugin**  **NagMinder \- (temp working name)**

## **Overview**

The **Nag Chrome Extension** helps you track time spent on distracting websites (like social media) and gently nudges you with humorous reminders. When you visit a social media site, a nag bar appears at the top of the page showing:

* Time spent **today**

* Time spent **this week**

* Time spent **this month**

* A rotating funny nag message

---

## **Step 1: Project Setup**

1. Create a new folder for your extension, e.g. `nag-extension/`.

Inside, create the following files:

 `nag-extension/`  
`├── manifest.json`  
`├── background.js`  
`├── content.js`  
`├── styles.css`  
`└── messages.js`

2. 

---

## **Step 2: Define the Manifest**

`{`  
  `"manifest_version": 3,`  
  `"name": "Nag Plugin",`  
  `"description": "Tracks time on social media and nags you about it.",`  
  `"version": "1.0",`  
  `"permissions": ["storage", "tabs"],`  
  `"background": {`  
    `"service_worker": "background.js"`  
  `},`  
  `"content_scripts": [`  
    `{`  
      `"matches": [`  
        `"*://*.facebook.com/*",`  
        `"*://*.twitter.com/*",`  
        `"*://*.x.com/*",`  
        `"*://*.instagram.com/*",`  
        `"*://*.reddit.com/*",`  
        `"*://*.tiktok.com/*"`  
      `],`  
      `"js": ["content.js"],`  
      `"css": ["styles.css"]`  
    `}`  
  `],`  
  `"action": {`  
    `"default_title": "Nag Plugin"`  
  `}`  
`}`

---

## **Step 3: Track Time in Background Script (`background.js`)**

`let siteTimes = {}; // { domain: { day: 0, week: 0, month: 0, lastActive: timestamp } }`

`chrome.runtime.onInstalled.addListener(() => {`  
  `chrome.storage.local.set({ siteTimes: {} });`  
`});`

`// Helper to get current domain`  
`function getDomain(url) {`  
  `try {`  
    `return new URL(url).hostname.replace("www.", "");`  
  `} catch {`  
    `return null;`  
  `}`  
`}`

`// Track tab updates`  
`chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {`  
  `if (changeInfo.status === "complete" && tab.url) {`  
    `const domain = getDomain(tab.url);`  
    `if (!domain) return;`

    `chrome.storage.local.get(["siteTimes"], (result) => {`  
      `let times = result.siteTimes || {};`  
      `if (!times[domain]) {`  
        `times[domain] = { day: 0, week: 0, month: 0, lastActive: Date.now() };`  
      `}`  
      `times[domain].lastActive = Date.now();`  
      `chrome.storage.local.set({ siteTimes: times });`  
    `});`  
  `}`  
`});`

`// Increment counters every minute`  
`setInterval(() => {`  
  `chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {`  
    `if (!tabs.length) return;`  
    `const domain = getDomain(tabs[0].url);`  
    `if (!domain) return;`

    `chrome.storage.local.get(["siteTimes"], (result) => {`  
      `let times = result.siteTimes || {};`  
      `if (!times[domain]) return;`

      `times[domain].day += 1;`  
      `times[domain].week += 1;`  
      `times[domain].month += 1;`

      `chrome.storage.local.set({ siteTimes: times });`  
    `});`  
  `});`  
`}, 60000); // every minute`

---

## **Step 4: Display the Nag Bar (`content.js`)**

`// Inject nag bar`  
`const nagBar = document.createElement("div");`  
`nagBar.id = "nag-bar";`  
`document.body.prepend(nagBar);`

`function formatTime(minutes) {`  
  ``if (minutes < 60) return `${minutes} min`;``  
  `const hrs = Math.floor(minutes / 60);`  
  `const mins = minutes % 60;`  
  ``return `${hrs}h ${mins}m`;``  
`}`

`function updateNag() {`  
  `chrome.storage.local.get(["siteTimes"], (result) => {`  
    `const domain = window.location.hostname.replace("www.", "");`  
    `const times = result.siteTimes?.[domain];`  
    `if (!times) return;`

    `const messages = [`  
      `"Come on man, don’t you have something better to do?",`  
      `"Your brain cells are begging for mercy.",`  
      `"This won’t get you a raise, you know.",`  
      `"Scrolling won’t solve your problems!",`  
      `"Another minute? Really?"`  
    `];`  
    `const message = messages[Math.floor(Math.random() * messages.length)];`

    `` nagBar.innerHTML = ` ``  
      `<strong>Nag Plugin:</strong>`   
      `Today: ${formatTime(times.day)} |`   
      `Week: ${formatTime(times.week)} |`   
      `Month: ${formatTime(times.month)}`   
      `<br/>${message}`  
    `` `; ``  
  `});`  
`}`

`setInterval(updateNag, 10000); // update every 10s`  
`updateNag();`

---

## **Step 5: Style the Bar (`styles.css`)**

`#nag-bar {`  
  `position: fixed;`  
  `top: 0;`  
  `left: 0;`  
  `width: 100%;`  
  `background: #ff5555;`  
  `color: white;`  
  `text-align: center;`  
  `font-family: sans-serif;`  
  `font-size: 14px;`  
  `padding: 6px;`  
  `z-index: 999999;`  
  `box-shadow: 0 2px 6px rgba(0,0,0,0.2);`  
`}`

---

## **Step 6: Load the Extension**

1. Open Chrome → `chrome://extensions/`.

2. Enable **Developer Mode**.

3. Click **Load unpacked** → select the `nag-extension/` folder.

4. Visit Facebook, Twitter, etc. and watch the nag bar appear.

---

## **Step 7: Optional Improvements**

* Add **options page** to configure which sites to nag.

* Add **snooze button** on the nag bar.

* Persist daily/weekly/monthly resets (reset counters at midnight, start of week, etc.).

* Sync data across devices via `chrome.storage.sync`.

* Add **funny GIFs or memes** to make nagging more playful.

