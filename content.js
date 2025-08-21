// content.js

// Import messages directly since ES6 modules aren't supported in content scripts
const DEFAULT_MESSAGES = [
  "Come on man, don't you have something better to do?",
  "Your future self is facepalming right now.",
  "Another minute won't hurt? That's what you said 30 minutes ago.",
  "Scrolling won't solve your problems.",
  "Be honest—was this what you planned to do today?",
  "Hey, Productivity called. It misses you.",
  "You're not stuck—you're just scrolling.",
  "Tiny nudge: ship something instead.",
  "Imagine if this were reps at the gym. Feeling it yet?",
  "Close me and take one step on your real goal.",
];

const BAR_ID = "nagminder-bar";
let state = {
  settings: null,
  times: null,
  meta: null,
};

// Build bar
function ensureBar() {
  let bar = document.getElementById(BAR_ID);
  if (bar) return bar;
  bar = document.createElement("div");
  bar.id = BAR_ID;
  bar.innerHTML = `
    <div class="nm-inner">
      <div class="nm-left">
        <span class="nm-title">NagMinder</span>
        <span class="nm-today">Today: --</span>
        <button class="nm-expand" title="Show more stats">•••</button>
        <div class="nm-detailed" style="display: none;">
          <span class="nm-week">Week: --</span>
          <span class="nm-month">Month: --</span>
          <span class="nm-year">Year: --</span>
          <span class="nm-alltime">All time: --</span>
        </div>
      </div>
      <div class="nm-center">
        <span class="nm-message"></span>
      </div>
      <div class="nm-right">
        <button class="nm-btn nm-snooze">Snooze 15m</button>
        <button class="nm-btn nm-pause">Pause Today</button>
        <button class="nm-btn nm-close" title="Hide for this page">×</button>
      </div>
    </div>
  `;
  document.documentElement.appendChild(bar);

  bar.querySelector(".nm-snooze").addEventListener("click", async () => {
    try {
      if (!chrome.runtime?.id) return;
      const domain = location.hostname.replace(/^www\./, "");
      await chrome.runtime.sendMessage({
        type: "nm_snooze",
        minutes: state.settings?.snoozeMinutes || 15,
        domain: domain,
      });
      hideBar();
    } catch {
      // Snooze failed silently
    }
  });
  bar.querySelector(".nm-pause").addEventListener("click", async () => {
    try {
      if (!chrome.runtime?.id) return;
      const domain = location.hostname.replace(/^www\./, "");
      await chrome.runtime.sendMessage({
        type: "nm_pause_today",
        domain: domain,
      });
      hideBar();
    } catch {
      // Pause failed silently
    }
  });
  bar.querySelector(".nm-close").addEventListener("click", () => {
    bar.style.display = "none";
  });

  // Toggle detailed stats
  bar.querySelector(".nm-expand").addEventListener("click", () => {
    const detailed = bar.querySelector(".nm-detailed");
    const expandBtn = bar.querySelector(".nm-expand");
    const isExpanded = detailed.style.display !== "none";

    detailed.style.display = isExpanded ? "none" : "block";
    expandBtn.textContent = isExpanded ? "•••" : "×";
    expandBtn.title = isExpanded ? "Show more stats" : "Hide stats";
  });

  return bar;
}

function hideBar() {
  const el = document.getElementById(BAR_ID);
  if (el) el.style.display = "none";
}

function showBar() {
  const el = ensureBar();
  el.style.display = "block";
}

function hostMatches(domains) {
  const host = location.hostname.replace(/^www\./, "");
  return domains.some((d) => host === d || host.endsWith("." + d));
}

function formatMinutes(mins) {
  if (mins == null) return "--";
  const total = Math.round(mins);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function pickMessage() {
  // Potential future: user-defined messages via settings
  const arr = DEFAULT_MESSAGES;
  return arr[Math.floor(Math.random() * arr.length)];
}

async function refresh() {
  try {
    // Check if extension context is valid
    if (!chrome.runtime?.id) {
      // Extension context invalidated
      return;
    }

    const resp = await chrome.runtime.sendMessage({ type: "nm_get_state" });

    // Handle case where background script returns undefined/null
    if (!resp) {
      // No response from background script
      return;
    }

    state = resp;
    const domains = state.settings?.domains ?? [];
    const enabled = !!state.settings?.enabled;

    // Check if this specific domain is snoozed/paused
    const host = location.hostname.replace(/^www\./, "");
    const domainMeta = state.meta?.domains?.[host];
    const snoozedOrPaused =
      domainMeta &&
      (Date.now() < (domainMeta.snoozeUntil || 0) || domainMeta.pausedToday);

    if (!enabled || !hostMatches(domains) || snoozedOrPaused) {
      hideBar();
      return;
    }

    // Host already defined above
    const t = state.times?.[host];
    if (!t) {
      // If we're on a tracked site but no counters yet, still show bar with zeros
      showBar();
      render({ day: 0, week: 0, month: 0, year: 0, allTime: 0 });
      return;
    }

    showBar();
    render(t);
  } catch (e) {
    // Check for specific connection errors
    if (
      e.message?.includes("Could not establish connection") ||
      e.message?.includes("Extension context invalidated") ||
      e.message?.includes("Receiving end does not exist")
    ) {
      // Background script not ready, will retry
      return;
    }
    // Extension error occurred
  }
}

function render(t) {
  const bar = ensureBar();
  bar.querySelector(".nm-today").textContent = `Today: ${formatMinutes(t.day)}`;
  bar.querySelector(".nm-week").textContent = `Week: ${formatMinutes(t.week)}`;
  bar.querySelector(".nm-month").textContent =
    `Month: ${formatMinutes(t.month)}`;
  bar.querySelector(".nm-year").textContent = `Year: ${formatMinutes(t.year)}`;
  bar.querySelector(".nm-alltime").textContent =
    `All time: ${formatMinutes(t.allTime)}`;
  bar.querySelector(".nm-message").textContent = pickMessage();

  // Update snooze button text with configured time
  const snoozeMinutes = state.settings?.snoozeMinutes || 15;
  bar.querySelector(".nm-snooze").textContent = `Snooze ${snoozeMinutes}m`;
}

// Listen for updates from background to refresh faster
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "nm_times_updated") {
    // Only refresh if it's the same host
    const host = location.hostname.replace(/^www\./, "");
    if (msg.host === host) refresh();
  }
});

// Initial load with retry
let retryCount = 0;
const maxRetries = 5;

async function initialLoad() {
  try {
    await refresh();
  } catch {
    retryCount++;
    if (retryCount < maxRetries) {
      // Retrying connection
      setTimeout(initialLoad, 1000);
    } else {
      // Max retries reached
    }
  }
}

// Start initial load
initialLoad();

// Periodic refresh
setInterval(refresh, 5000);
