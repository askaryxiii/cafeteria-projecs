import { DateTime } from "luxon";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/g, "");
const SERVER_TIME_URL = API_BASE
  ? `${API_BASE}/stats/server-time`
  : "/stats/server-time";
const RESYNC_INTERVAL_MS = 8 * 60 * 1000; // 8 minutes
const TIMEZONE = "Africa/Cairo";

let serverEpoch = null;
let clientEpoch = null;
let offset = 0;
let lastSyncAt = null;
let resyncTimer = null;
let initPromise = null;

function scheduleResync() {
  if (resyncTimer) {
    clearTimeout(resyncTimer);
  }

  resyncTimer = setTimeout(async () => {
    try {
      await initTimeSync(true);
    } catch (error) {
      console.warn("[timeClient] auto resync failed", error);
      scheduleResync();
    }
  }, RESYNC_INTERVAL_MS);
}

function normaliseDateTime(value) {
  if (DateTime.isDateTime(value)) {
    return value.setZone(TIMEZONE);
  }

  if (typeof value === "string") {
    return DateTime.fromISO(value, { zone: TIMEZONE });
  }

  if (typeof value === "number") {
    return DateTime.fromMillis(value, { zone: TIMEZONE });
  }

  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: TIMEZONE });
  }

  throw new TypeError("Unsupported date value passed to timeClient");
}

function extractServerEpoch(data) {
  if (data == null) return null;
  if (typeof data.serverEpoch === "number") return data.serverEpoch;
  if (typeof data.timestamp === "number") return data.timestamp;
  if (typeof data.serverTime === "number") return data.serverTime;
  if (typeof data.serverTime === "string") {
    const parsed = Date.parse(data.serverTime);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

async function fetchServerTime() {
  const requestClientEpoch = Date.now();
  const url = SERVER_TIME_URL;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Server time sync failed: ${response.status} ${response.statusText} @ ${url}`,
    );
  }

  const data = await response.json();
  const serverEpochValue = extractServerEpoch(data);
  if (serverEpochValue == null) {
    throw new Error(
      `Server time response missing serverEpoch or timestamp @ ${url}`,
    );
  }

  return {
    data: {
      ...data,
      serverEpoch: serverEpochValue,
    },
    requestClientEpoch,
  };
}

export async function initTimeSync(isAutoRefresh = false) {
  if (!isAutoRefresh && initPromise) {
    return initPromise;
  }

  const syncWork = async () => {
    const { data, requestClientEpoch } = await fetchServerTime();
    serverEpoch = data.serverEpoch;
    clientEpoch = requestClientEpoch;
    offset = serverEpoch - clientEpoch;
    lastSyncAt = requestClientEpoch;
    scheduleResync();
    return {
      serverEpoch,
      clientEpoch,
      offset,
      timezone: data.timezone || TIMEZONE,
      iso: data.iso,
      date: data.date,
      time: data.time,
      weekday: data.weekday,
      dayOfWeek: data.dayOfWeek,
    };
  };

  if (!isAutoRefresh) {
    initPromise = syncWork().finally(() => {
      initPromise = null;
    });
    return initPromise;
  }

  return syncWork();
}

export function now() {
  const millis = Date.now() + offset;
  return DateTime.fromMillis(millis).setZone(TIMEZONE);
}

export function nowISO() {
  return now().toISO();
}

export function nowDate() {
  return now().toISODate();
}

export function nowTime() {
  return now().toFormat("HH:mm");
}

export function addDays(days) {
  return now().plus({ days });
}

export function getWeekday() {
  return now().weekday;
}

export function isSameDay(date1, date2) {
  const a = normaliseDateTime(date1);
  const b = normaliseDateTime(date2);
  return a.hasSame(b, "day");
}

export function parseISO(value) {
  return normaliseDateTime(value);
}

export function toISODate(dateOrDateTime) {
  return normaliseDateTime(dateOrDateTime).toISODate();
}

export function toJSDate(dateOrDateTime) {
  return normaliseDateTime(dateOrDateTime).toJSDate();
}

export default {
  initTimeSync,
  now,
  nowISO,
  nowDate,
  nowTime,
  addDays,
  getWeekday,
  isSameDay,
  parseISO,
  toISODate,
  toJSDate,
};
