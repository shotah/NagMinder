// background.js (service worker)

/**
 * @typedef {Object} Settings
 * @property {boolean} enabled
 * @property {number} tickSeconds
 * @property {string[]} domains
 * @property {number} snoozeMinutes
 */

/**
 * @typedef {Object} TimeData
 * @property {number} day
 * @property {number} week
 * @property {number} month
 * @property {number} year
 * @property {number} allTime
 * @property {number} lastActive
 */

/**
 * @typedef {Object} MetaData
 * @property {string|null} lastDay
 * @property {string|null} lastWeek
 * @property {string|null} lastMonth
 * @property {string|null} lastYear
 * @property {Object.<string, DomainMeta>} domains
 */

/**
 * @typedef {Object} DomainMeta
 * @property {number} snoozeUntil
 * @property {boolean} pausedToday
 */

// Settings keys
const SETTINGS_KEY = "nm_settings";
const TIMES_KEY = "nm_siteTimes";
const META_KEY = "nm_meta";

// Defaults
const DEFAULT_SETTINGS = {
  enabled: true,
  tickSeconds: 5,
  // Default tracked domains (can edit in Options)
  domains: [
    "facebook.com",
    "x.com",
    "twitter.com",
    "linkedin.com",
    "instagram.com",
    "reddit.com",
    "tiktok.com",
    "youtube.com",
    "pinterest.com",
    "snapchat.com",
    "strava.com",
  ],
  snoozeMinutes: 15,
  idleThresholdMinutes: 5, // How long before considering user idle
};

const initialMeta = {
  lastDay: null,
  lastWeek: null,
  lastMonth: null,
  lastYear: null,
  domains: {}, // per-domain snooze/pause data
};

// Utility: get active tab URL
async function getActiveUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length) return null;
  return tabs[0].url || null;
}

function hostnameFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Get extension settings from sync storage
 * @returns {Promise<Settings>} Current settings
 */
async function getSettings() {
  const { [SETTINGS_KEY]: settings } =
    await chrome.storage.sync.get(SETTINGS_KEY);
  return settings ?? DEFAULT_SETTINGS;
}

async function setSettings(newSettings) {
  await chrome.storage.sync.set({ [SETTINGS_KEY]: newSettings });
}

async function getTimes() {
  const { [TIMES_KEY]: t } = await chrome.storage.sync.get(TIMES_KEY);
  return t ?? {};
}

async function setTimes(times) {
  await chrome.storage.sync.set({ [TIMES_KEY]: times });
}

async function getMeta() {
  const { [META_KEY]: m } = await chrome.storage.sync.get(META_KEY);
  return m ?? initialMeta;
}

async function setMeta(meta) {
  await chrome.storage.sync.set({ [META_KEY]: meta });
}

// Helper functions for per-domain snooze/pause
function getDomainMeta(meta, domain) {
  if (!meta.domains) meta.domains = {};
  if (!meta.domains[domain]) {
    meta.domains[domain] = { snoozeUntil: 0, pausedToday: false };
  }
  return meta.domains[domain];
}

// Helper function for checking if domain is snoozed (could be useful for future features)
// function isDomainSnoozed(meta, domain) {
//   const domainMeta = getDomainMeta(meta, domain);
//   return Date.now() < domainMeta.snoozeUntil || domainMeta.pausedToday;
// }

// Date helpers
function formatDateParts(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const dayKey = `${yyyy}-${mm}-${dd}`;

  // ISO week calc
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  const weekKey = `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;

  const monthKey = `${yyyy}-${mm}`;
  const yearKey = `${yyyy}`;
  return { dayKey, weekKey, monthKey, yearKey };
}

// Increment logic
async function tick() {
  try {
    const settings = await getSettings();
    if (!settings.enabled) return;

    // Idle or unfocused? Don't count.
    const idleThresholdSeconds = (settings.idleThresholdMinutes || 5) * 60;
    const idleState = await chrome.idle.queryState(idleThresholdSeconds);
    if (idleState !== "active") return;

    const url = await getActiveUrl();
    if (!url) return;
    const host = hostnameFromUrl(url);
    if (!host) return;

    // Only count if host matches tracked domains or subdomains thereof
    const match = settings.domains.some(
      (d) => host === d || host.endsWith("." + d)
    );
    if (!match) return;

    const meta = await getMeta();
    const times = await getTimes();
    const { dayKey, weekKey, monthKey, yearKey } = formatDateParts(new Date());

    // Reset buckets when date boundaries change
    if (meta.lastDay !== dayKey) {
      // reset daily counters per domain
      for (const h of Object.keys(times)) {
        times[h].day = 0;
      }
      meta.lastDay = dayKey;
      // reset daily pause for all domains
      if (meta.domains) {
        for (const domain of Object.keys(meta.domains)) {
          meta.domains[domain].pausedToday = false;
        }
      }
    }
    if (meta.lastWeek !== weekKey) {
      for (const h of Object.keys(times)) {
        times[h].week = 0;
      }
      meta.lastWeek = weekKey;
    }
    if (meta.lastMonth !== monthKey) {
      for (const h of Object.keys(times)) {
        times[h].month = 0;
      }
      meta.lastMonth = monthKey;
    }
    if (meta.lastYear !== yearKey) {
      for (const h of Object.keys(times)) {
        times[h].year = 0;
      }
      meta.lastYear = yearKey;
    }

    if (!times[host]) {
      times[host] = {
        day: 0,
        week: 0,
        month: 0,
        year: 0,
        allTime: 0,
        lastActive: Date.now(),
      };
    }

    // Increment by tickSeconds
    const incMinutes = (settings.tickSeconds || 5) / 60;
    times[host].day += incMinutes;
    times[host].week += incMinutes;
    times[host].month += incMinutes;
    times[host].year += incMinutes;
    times[host].allTime += incMinutes;
    times[host].lastActive = Date.now();

    await setTimes(times);
    await setMeta(meta);

    // Notify content scripts that data changed (so they can refresh faster)
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs.length > 0) {
        chrome.tabs
          .sendMessage(tabs[0].id, { type: "nm_times_updated", host })
          .catch(() => {
            // Content script may not be ready, ignore
          });
      }
    } catch {
      // Tab may not be accessible, ignore
    }
  } catch {
    // Tick error occurred
  }
}

// Message handlers (content/options pages)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg?.type === "nm_get_state") {
        const [settings, times, meta] = await Promise.all([
          getSettings(),
          getTimes(),
          getMeta(),
        ]);
        sendResponse({ settings, times, meta });
      } else if (msg?.type === "nm_set_settings") {
        const settings = await getSettings();
        const next = { ...settings, ...msg.payload };
        await setSettings(next);
        sendResponse({ ok: true });
      } else if (msg?.type === "nm_snooze") {
        const meta = await getMeta();
        const mins = msg?.minutes ?? 15;
        const domain = msg?.domain;
        if (domain) {
          const domainMeta = getDomainMeta(meta, domain);
          domainMeta.snoozeUntil = Date.now() + mins * 60 * 1000;
          await setMeta(meta);
          sendResponse({ ok: true });
        } else {
          sendResponse({ ok: false, error: "domain_required" });
        }
      } else if (msg?.type === "nm_pause_today") {
        const meta = await getMeta();
        const domain = msg?.domain;
        if (domain) {
          const domainMeta = getDomainMeta(meta, domain);
          domainMeta.pausedToday = true;
          await setMeta(meta);
          sendResponse({ ok: true });
        } else {
          sendResponse({ ok: false, error: "domain_required" });
        }
      } else if (msg?.type === "nm_reset_all") {
        await chrome.storage.sync.remove([TIMES_KEY, META_KEY]);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false, error: "unknown_message" });
      }
    } catch (e) {
      // Message handler error occurred
      sendResponse({ ok: false, error: e.message });
    }
  })();
  return true; // async
});

// Kick off tick loop
async function setup() {
  const meta = await getMeta();
  const { dayKey, weekKey, monthKey, yearKey } = formatDateParts(new Date());
  if (!meta.lastDay) meta.lastDay = dayKey;
  if (!meta.lastWeek) meta.lastWeek = weekKey;
  if (!meta.lastMonth) meta.lastMonth = monthKey;
  if (!meta.lastYear) meta.lastYear = yearKey;
  await setMeta(meta);

  const settings = await getSettings();
  const intervalMs = (settings.tickSeconds || 5) * 1000;
  setInterval(tick, intervalMs);
}

setup();
