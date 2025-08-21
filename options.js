// options.js
const SETTINGS_KEY = "nm_settings";
const DEFAULTS = {
  enabled: true,
  tickSeconds: 5,
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
  idleThresholdMinutes: 5,
};

async function load() {
  const { [SETTINGS_KEY]: s } = await chrome.storage.sync.get(SETTINGS_KEY);
  const settings = s ?? DEFAULTS;
  document.getElementById("enabled").checked = !!settings.enabled;
  document.getElementById("domains").value = (
    settings.domains || DEFAULTS.domains
  ).join("\n");
  document.getElementById("snooze").value =
    settings.snoozeMinutes ?? DEFAULTS.snoozeMinutes;
  document.getElementById("tick").value =
    settings.tickSeconds ?? DEFAULTS.tickSeconds;
  document.getElementById("idle").value =
    settings.idleThresholdMinutes ?? DEFAULTS.idleThresholdMinutes;
}

async function save() {
  const next = {
    enabled: document.getElementById("enabled").checked,
    domains: document
      .getElementById("domains")
      .value.split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
    snoozeMinutes: parseInt(document.getElementById("snooze").value, 10) || 15,
    tickSeconds: Math.max(
      1,
      parseInt(document.getElementById("tick").value, 10) || 5
    ),
    idleThresholdMinutes: Math.max(
      1,
      parseInt(document.getElementById("idle").value, 10) || 5
    ),
  };
  await chrome.storage.sync.set({ [SETTINGS_KEY]: next });
  alert("Saved!");
}

async function resetCounters() {
  await chrome.runtime.sendMessage({ type: "nm_reset_all" });
  alert("Counters reset.");
}

document.getElementById("save").addEventListener("click", save);
document.getElementById("reset").addEventListener("click", resetCounters);
document.addEventListener("DOMContentLoaded", load);
