const API_URL = import.meta.env.VITE_API_BASE;

// Helper to add ngrok-skip-browser-warning to all headers
function getHeaders(baseHeaders = {}) {
  return {
    "ngrok-skip-browser-warning": "true",
    ...baseHeaders,
  };
}

let serverTimeOffset = null;
let lastServerTimeUpdate = 0;

// Get server time - fetches fresh from server each time (no caching offset)
// Returns { date: Date, dayOfWeek: number }
export async function getServerTime() {
  try {
    const res = await fetch(`${API_URL}/stats/server-time`, {
      headers: getHeaders({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      }),
    });

    if (!res.ok) {
      console.warn("Failed to fetch server time, using local time");
      const localDate = new Date();
      return {
        date: localDate,
        dayOfWeek: localDate.getUTCDay(),
      };
    }

    const data = await res.json();
    const serverTime = data.serverTime;
    const tmwServerTime = data.serverTmwTime;
    const dayOfWeek = data.dayOfWeek;
    const tmwDayOfWeek = data.tmwDayOfWeek;

    // Ensure we have a valid serverTime
    if (!serverTime) {
      console.warn("No serverTime  in server response:", data);
      const localDate = new Date();
      return {
        date: localDate,
        dayOfWeek: localDate.getUTCDay(),
      };
    }

    // Handle both milliseconds (number) and ISO strings
    let serverTimeMs;
    if (typeof serverTime === "number") {
      serverTimeMs = serverTime;
    } else {
      // Parse ISO string or other string formats
      const parsedDate = new Date(serverTime);
      serverTimeMs = parsedDate.getTime();
    }
    let tmwServerTimeMs;
    if (typeof tmwServerTime === "number") {
      tmwServerTimeMs = tmwServerTime;
    } else {
      const parsedDate = new Date(tmwServerTime);
      tmwServerTimeMs = parsedDate.getTime();
    }

    // Validate the parsed time
    if (isNaN(serverTimeMs)) {
      console.warn("Invalid serverTime  from server:", serverTime);
      const localDate = new Date();
      return {
        date: localDate,
        dayOfWeek: localDate.getUTCDay(),
      };
    }

    // Update cache with fresh server time for use in getCurrentTime()
    serverTimeOffset = serverTimeMs - Date.now();
    lastServerTimeUpdate = Date.now();

    const serverDate = new Date(serverTimeMs);
    const tmwServerDate = new Date(tmwServerTimeMs);
    return {
      date: serverDate,
      tmwDate: tmwServerDate,
      dayOfWeek: dayOfWeek !== undefined ? dayOfWeek : serverDate.getUTCDay(),
      tmwDayOfWeek:
        tmwDayOfWeek !== undefined ? tmwDayOfWeek : tmwServerDate.getUTCDay(),
    };
  } catch (error) {
    console.warn("Error fetching server time:", error);
    const localDate = new Date();
    return {
      date: localDate,
      dayOfWeek: localDate.getUTCDay(),
    };
  }
}

// Synchronous version - uses cached offset (won't be perfect on first call)
export function getCurrentTime() {
  if (serverTimeOffset !== null) {
    return new Date(Date.now() + serverTimeOffset);
  }
  return new Date();
}

// Helper function to format date as YYYY-MM-DD using server time (UTC timezone)
export function formatServerDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function to get tomorrow's date based on server time (UTC)
export function getTomorrowDate(serverTime) {
  const tomorrow = new Date(serverTime);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow;
}

// Helper function to get next Monday based on server time
// If today is Monday, returns today; if Friday/Saturday/Sunday, returns next Monday
export function getNextMondayDate(serverTime) {
  const date = new Date(serverTime);
  // Use getUTCDay() to get the day in UTC, not local timezone
  const day = date.getUTCDay(); // 0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday

  let daysToAdd = 0;
  if (day === 0) {
    // Sunday -> Monday (1 day)
    daysToAdd = 1;
  } else if (day === 5) {
    // Friday -> Monday (3 days)
    daysToAdd = 3;
  } else if (day === 6) {
    // Saturday -> Monday (2 days)
    daysToAdd = 2;
  } else if (day === 1) {
    // Monday -> Monday (0 days, today)
    daysToAdd = 0;
  }

  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date;
}

// Get tomorrow's date or Monday if today is Fri/Sat/Sun (for cafeteria lunch display)
export async function getCafeteriaLunchDate() {
  const { date: serverTime, dayOfWeek: day } = await getServerTime();

  // If today is Friday (5), Saturday (6), or Sunday (0), show Monday
  if (day === 5 || day === 6 || day === 0) {
    return formatServerDate(getNextMondayDate(serverTime));
  }

  // Otherwise, show tomorrow
  return formatServerDate(getTomorrowDate(serverTime));
}

// Get the lunch order date based on current day and time
// Returns tomorrow for regular days, or Monday for Friday/Saturday/Sunday
export async function getLunchOrderDate() {
  const { date: serverTime, dayOfWeek: day } = await getServerTime();

  // If today is Friday (5), Saturday (6), or Sunday (0), order for Monday
  if (day === 5 || day === 6 || day === 0) {
    return formatServerDate(getNextMondayDate(serverTime));
  }

  // Otherwise, order for tomorrow
  return formatServerDate(getTomorrowDate(serverTime));
}

// Get the date to check for existing lunch orders
// Returns Monday for Friday/Saturday/Sunday, otherwise tomorrow
export async function getLunchCheckDate() {
  const { date: serverTime, dayOfWeek: day } = await getServerTime();

  // If today is Friday (5), Saturday (6), or Sunday (0), check for Monday
  if (day === 5 || day === 6 || day === 0) {
    return formatServerDate(getNextMondayDate(serverTime));
  }

  // Otherwise, check for tomorrow
  return formatServerDate(getTomorrowDate(serverTime));
}

// Get server time and extract hour/minute for time window checks (ALWAYS USE UTC)
export async function getServerTimeComponents() {
  const {
    date: serverTime,
    dayOfWeek: day,
    tmwDate: tmwDate,
    tmwDayOfWeek: tmwDayOfWeek,
  } = await getServerTime();
  return {
    date: serverTime,
    tmwDate: tmwDate,
    hour: serverTime.getUTCHours(), // Use UTC hours, not local
    minute: serverTime.getUTCMinutes(), // Use UTC minutes, not local
    dateString: formatServerDate(serverTime),
    // tomorrowString: formatServerDate(getNextOrderDate(serverTime)),
    tomorrowString: formatServerDate(getTomorrowDate(serverTime)),
    day: day,
    tmwDayOfWeek: tmwDayOfWeek,
  };
}

// Get the current day of the week (0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday)
export async function getCurrentDayOfWeek() {
  const { dayOfWeek } = await getServerTime();
  return dayOfWeek;
}

// Get the name of today's weekday
export async function getTodayWeekday() {
  const day = await getCurrentDayOfWeek();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

// Check if today is Friday (day 5)
export async function isFridayOrWeekend() {
  const day = await getCurrentDayOfWeek();
  return [5, 6, 0].includes(day);
}

export function readToken() {
  try {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      null
    );
  } catch (e) {
    return null;
  }
}

function formatDateYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// returns next Monday date (if today is Monday returns today)
function getNextMonday(from = getCurrentTime()) {
  const day = from.getDay(); // 0 (Sun) - 6 (Sat)
  const daysToAdd = (8 - day) % 7; // 0 when Monday
  const next = new Date(from);
  next.setDate(from.getDate() + daysToAdd);
  next.setHours(0, 0, 0, 0);
  return next;
}

export async function getWeeklyMeals() {
  try {
    const token = readToken();
    if (!token) return { error: "No auth token found" };

    // verify token
    const verifyRes = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }

    // compute next monday
    const { date: serverTime } = await getServerTime();
    const nextMonday = getNextMonday(serverTime);
    const dateStr = formatDateYYYYMMDD(nextMonday);

    const res = await fetch(`${API_URL}/weekly-menu/${dateStr}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        error: err.message || `Failed to fetch weekly menu for ${dateStr}`,
      };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error Getting Data:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getTodayMenuByCategory(categoryName) {
  try {
    const token = readToken();
    if (!token) return { error: "No auth token found" };

    const verifyRes = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }

    const { date: serverTime, dayOfWeek: day } = await getServerTime();

    // For lunch category, use special logic: Mon if Fri/Sat/Sun, else tomorrow
    let menuDate;
    if (
      categoryName.toLowerCase() === "salad" ||
      categoryName.toLowerCase() === "carbs" ||
      categoryName.toLowerCase() === "protein" ||
      categoryName.toLowerCase() === "side"
    ) {
      // These are lunch categories - use getLunchOrderDate logic
      if (day === 5 || day === 6 || day === 0) {
        menuDate = formatServerDate(getNextMondayDate(serverTime));
      } else {
        menuDate = formatServerDate(getTomorrowDate(serverTime));
      }
    } else {
      // Breakfast or other categories - use regular tomorrow
      menuDate = formatServerDate(getTomorrowDate(serverTime));
    }

    const res = await fetch(`${API_URL}/daily-menu/${menuDate}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        error: err.message || `Failed to fetch daily menu`,
      };
    }

    const data = await res.json();

    // ✅ FILTER HERE
    const filtered = data.filter(
      (item) => item.category.toLowerCase() === categoryName.toLowerCase(),
    );

    return filtered;
  } catch (err) {
    console.error("Error Getting Data:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Get menu items by category for a specific date
export async function getMenuByCategoryAndDate(categoryName, dateString) {
  try {
    const token = readToken();
    if (!token) return { error: "No auth token found" };

    const verifyRes = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }

    const res = await fetch(`${API_URL}/daily-menu/${dateString}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        error: err.message || `Failed to fetch daily menu for ${dateString}`,
      };
    }

    const data = await res.json();

    // ✅ FILTER BY CATEGORY
    const filtered = data.filter(
      (item) => item.category.toLowerCase() === categoryName.toLowerCase(),
    );

    return filtered;
  } catch (err) {
    console.error("Error Getting Data:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getBreakfast() {
  try {
    const token = readToken();
    if (!token) return { error: "No auth token found" };

    const verifyRes = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }
    const res = await fetch(`${API_URL}/menu`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        error: err.message || `Failed to fetch daily menu`,
      };
    }

    const data = await res.json();

    // ✅ FILTER HERE
    const filtered = data.filter(
      (item) => item.meal_type.toLowerCase() === "breakfast",
    );

    return filtered;
  } catch (err) {
    console.error("Error Getting Data:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getTotalPrice(selectedItems, token) {
  let total = 0;

  // Flatten to list of codes like ["PM4","PM3","CA2", ...]
  const codes = Object.values(selectedItems).flat();

  for (const code of codes) {
    const res = await fetch(`${API_URL}/menu/code/${code}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });

    if (!res.ok) continue;

    const item = await res.json();
    // Ensure price is number
    total += parseFloat(item.price || 0);
  }

  return total;
}

export async function placeOrder(orderData, token) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      }),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Order failed" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error Placing Order:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function parseToken(token) {
  try {
    const t = token || readToken();
    if (!t) return null;
    const res = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${t}` }),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data) return null;
    // Expecting { success: true, user: { ... } }
    const user = data.user || null;
    if (!user) return null;
    return { user, token: t };
  } catch (e) {
    return null;
  }
}

// In-memory cache for a recent server-verified user. Cache is keyed by token
// and cleared when the token changes or explicitly via clearVerifiedUserCache.
let _cachedVerifiedUser = null;
let _cachedVerifiedToken = null;

export function clearVerifiedUserCache() {
  _cachedVerifiedUser = null;
  _cachedVerifiedToken = null;
}

export async function getVerifiedUser(token) {
  const t = token || readToken();
  if (!t) return null;
  if (_cachedVerifiedToken === t && _cachedVerifiedUser)
    return _cachedVerifiedUser;
  // parseToken performs server verification and returns { user, token }
  const parsed = await parseToken(t);
  if (!parsed || !parsed.user) return null;
  _cachedVerifiedToken = t;
  _cachedVerifiedUser = parsed.user;
  return _cachedVerifiedUser;
}

export async function getOrdersByDate(dateStr, token) {
  try {
    const res = await fetch(`${API_URL}/orders?date=${dateStr}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    return { error: err.message || "Something went wrong" };
  }
}

/**
 * Get orders for a user for a month: /orders/{userId}?month=MM&year=YYYY
 * If token is provided, will parse user id from token when userId not given.
 */
export async function getUserOrdersForMonth(userId, month, year, token) {
  try {
    // if token not provided, try to read
    let t = token;
    if (!t) {
      t = readToken();
      if (!t) return { error: "No auth token" };
    }

    // if userId not provided, obtain it from verified user (cached)
    let uid = userId;
    if (!uid) {
      const u = await getVerifiedUser(t);
      uid = u?.id;
    }

    if (!uid) return { error: "No user id available" };

    const res = await fetch(
      `${API_URL}/orders/${uid}?month=${month}&year=${year}`,
      {
        headers: getHeaders({
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch user orders" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user orders for month:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getUserOrdersByDate(dateStr, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token" };
    // obtain verified user from cache/service
    const u = await getVerifiedUser(t);
    const uid = u?.id;
    if (!uid) return { error: "No user id in token" };

    const month = new Date(dateStr).getMonth() + 1; // 1-based
    const year = new Date(dateStr).getFullYear();

    const monthly = await getUserOrdersForMonth(uid, month, year, t);
    if (monthly && monthly.error) return monthly;

    // filter by date
    const filtered = (Array.isArray(monthly) ? monthly : []).filter(
      (o) => o.date === dateStr,
    );

    return filtered;
  } catch (err) {
    console.error("Error getting user orders by date:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllOrdersForToday() {
  try {
    const { date: serverTime } = await getServerTime();

    // Validate that serverTime is a valid Date
    if (!serverTime || isNaN(serverTime.getTime())) {
      console.error("Invalid server time:", serverTime);
      return { error: "Failed to get valid server time" };
    }

    const today = formatServerDate(serverTime);
    const token = readToken();

    const res = await fetch(`${API_URL}/orders/all/${today}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }

    const data = await res.json();
    // Extract breakfast, lunch, and drinks orders
    const breakfastOrders = data.breakfastOrders || [];
    const lunchOrders = data.lunchOrders || [];
    const drinksOrders = data.drinksOrders || [];

    return { breakfastOrders, lunchOrders, drinksOrders };
  } catch (err) {
    console.error("Error fetching today's orders:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllOrdersForTomorrow() {
  try {
    const { date: serverTime } = await getServerTime();

    // Validate that serverTime is a valid Date
    if (!serverTime || isNaN(serverTime.getTime())) {
      console.error("Invalid server time:", serverTime);
      return { error: "Failed to get valid server time" };
    }

    const tomorrow = getTomorrowDate(serverTime);
    const tomorrowString = formatServerDate(tomorrow);
    const token = readToken();

    const res = await fetch(`${API_URL}/orders/all/${tomorrowString}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }

    const data = await res.json();
    // Extract breakfast, lunch, and drinks orders
    const breakfastOrders = data.breakfastOrders || [];
    const lunchOrders = data.lunchOrders || [];
    const drinksOrders = data.drinksOrders || [];

    return { breakfastOrders, lunchOrders, drinksOrders };
  } catch (err) {
    console.error("Error fetching tomorrow's orders:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Get orders for a specific date (YYYY-MM-DD format)
export async function getAllOrdersForDate(dateString) {
  try {
    const token = readToken();

    const res = await fetch(`${API_URL}/orders/all/${dateString}`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }

    const data = await res.json();
    // Extract breakfast, lunch, and drinks orders
    const breakfastOrders = data.breakfastOrders || [];
    const lunchOrders = data.lunchOrders || [];
    const drinksOrders = data.drinksOrders || [];

    return { breakfastOrders, lunchOrders, drinksOrders };
  } catch (err) {
    console.error("Error fetching orders for date:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getChefOrders() {
  const token = readToken();

  try {
    const res = await fetch(`${API_URL}/chef/orders/today`, {
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }

    const data = await res.json();
    // Extract breakfast and lunch orders
    return data;
  } catch (err) {
    console.error("Error fetching today's orders:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getUserOrderFromTo(userId, from, to) {
  try {
    const token = readToken();
    if (!token) return { error: "No auth token found" };

    const verifyRes = await fetch(`${API_URL}/auth/verify-token`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }
    const res = await fetch(
      `${API_URL}/orders/${userId}?from=${from}&to=${to}`,
      {
        headers: getHeaders({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        error: err.message || `Failed to fetch user order by date range`,
      };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user order by date range:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function changePassword(currentPassword, newPassword, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      }),
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to change password" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error changing password:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function submitFeedback(feedbackData, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/feedbacks`, {
      method: "POST",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      }),
      body: JSON.stringify(feedbackData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to submit feedback" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error submitting feedback:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Get all feedbacks
export async function getAllFeedbacks(token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/feedbacks`, {
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch feedbacks" };
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Delete a feedback by ID
export async function deleteFeedback(feedbackId, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/feedbacks/${feedbackId}`, {
      method: "DELETE",
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to delete feedback" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting feedback:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Update feedback status
export async function updateFeedbackStatus(feedbackId, status, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/feedbacks/${feedbackId}/status`, {
      method: "PATCH",
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to update feedback status" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error updating feedback status:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllUsers(token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/users`, {
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch users" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function editUser(userId, userData, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      }),
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to edit user" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error editing user:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function deleteUser(userId, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };

    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to delete user" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting user:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllMenuItems(token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/menu`, {
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch users" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function editMenuItem(itemId, itemData, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/menu/${itemId}`, {
      method: "PUT",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      }),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to edit menu item" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error editing menu item:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllMenuItemById(token, itemId) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/menu/${itemId}`, {
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch users" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function deleteMenuItem(itemId, token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/menu/${itemId}`, {
      method: "DELETE",
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to delete menu item" };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting menu item:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function deleteOrder(orderId) {
  // TODO: Replace with real delete route when available
  const token = readToken();

  try {
    // Dummy route placeholder
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: getHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to delete order" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error deleting order:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getStats(token) {
  try {
    const t = token || readToken();
    if (!t) return { error: "No auth token found" };
    const res = await fetch(`${API_URL}/stats/system`, {
      headers: getHeaders({
        Authorization: `Bearer ${t}`,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch stats" };
    }
    const data = await res.json();

    return data;
  } catch (err) {
    console.error("Error fetching stats:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getOrderWindows() {
  try {
    const token = readToken();
    if (!token) {
      console.warn("No auth token found for getOrderWindows");
      return null;
    }

    const response = await fetch(`${API_URL}/order-windows`, {
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });

    if (!response.ok) {
      console.warn("Failed to fetch order windows");
      return null;
    }

    const data = await response.json();

    // Extract windows object if it exists, otherwise use root level
    return data?.windows || data;
  } catch (error) {
    console.error("Error fetching order windows:", error);
    return null;
  }
}

export function parseTimeToHours(timeString) {
  // Converts "11:00" or "11" to 11
  const parts = timeString.split(":");
  return parseInt(parts[0]);
}

export function parseTimeToMinutes(timeString) {
  // Converts "11:30" to 30, or "11" to 0
  const parts = timeString.split(":");
  return parseInt(parts[1] || 0);
}

export function isTimeInWindow(hour, minute, startTime, endTime) {
  // Check if current time is within the window
  const startHour = parseTimeToHours(startTime);
  const startMinute = parseTimeToMinutes(startTime);
  const endHour = parseTimeToHours(endTime);
  const endMinute = parseTimeToMinutes(endTime);

  const currentTotalMinutes = hour * 60 + minute;
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return (
    currentTotalMinutes >= startTotalMinutes &&
    currentTotalMinutes <= endTotalMinutes
  );
}

export async function userDetailed(from, to) {
  try {
    const token = readToken();
    if (!token) {
      console.warn("No auth token found for accountant");
      return null;
    }

    const response = await fetch(
      `${API_URL}/accountant/users-detailed?from_date=${from}&to_date=${to}`,
      {
        headers: getHeaders({ Authorization: `Bearer ${token}` }),
      },
    );

    if (!response.ok) {
      console.warn("Failed to fetch users detailed");
      return null;
    }

    const data = await response.json();

    return { period: data.period, users: data.users };
  } catch (error) {
    console.error("Error fetching users detailed:", error);
    return null;
  }
}

export async function getExcelData(from, to) {
  try {
    const token = readToken();
    if (!token) {
      console.warn("No auth token found for accountant");
      return null;
    }

    const response = await fetch(
      `${API_URL}/accountant/export-excel?from_date=${from}&to_date=${to}`,
      {
        headers: getHeaders({ Authorization: `Bearer ${token}` }),
      },
    );

    if (!response.ok) {
      console.warn("Failed to fetch users detailed");
      return null;
    }

    const data = await response.json();

    return {
      mainData: data.mainData,
      ordersData: data.ordersData,
      priceData: data.priceData,
    };
  } catch (error) {
    console.error("Error fetching users detailed:", error);
    return null;
  }
}

// Get all available drinks
export async function getAvailableDrinks() {
  try {
    const token = readToken();
    const res = await fetch(`${API_URL}/available-drinks/all`, {
      headers: getHeaders({
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      return {
        error: text || `Failed to fetch available drinks (${res.status})`,
      };
    }

    const data = await res.json().catch(() => null);
    return data || { items: [] };
  } catch (err) {
    console.error("Error fetching available drinks:", err);
    return { error: err.message || "Something went wrong" };
  }
}

// Update availability for multiple drinks
export async function updateAvailableDrinks(items = []) {
  try {
    const token = readToken();
    const body = { items };

    const res = await fetch(`${API_URL}/available-drinks`, {
      method: "PATCH",
      headers: getHeaders({
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      return {
        error: text || `Failed to update available drinks (${res.status})`,
      };
    }

    const data = await res.json().catch(() => null);
    return data || { success: true };
  } catch (err) {
    console.error("Error updating available drinks:", err);
    return { error: err.message || "Something went wrong" };
  }
}
