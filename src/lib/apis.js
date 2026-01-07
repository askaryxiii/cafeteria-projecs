const API_URL = import.meta.env.VITE_API_BASE;

// Helper to add ngrok-skip-browser-warning to all headers
function getHeaders(baseHeaders = {}) {
  return {
    "ngrok-skip-browser-warning": "true",
    ...baseHeaders,
  };
}

// Cache for server time offset to minimize API calls
let serverTimeOffset = null;
let lastServerTimeUpdate = 0;

// Get server time - fetches fresh from server each time (no caching offset)
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
      return new Date();
    }

    const data = await res.json();
    const timestamp = data.serverTime;

    // Ensure we have a valid timestamp
    if (!timestamp) {
      console.warn("No timestamp in server response:", data);
      return new Date();
    }

    // Handle both milliseconds (number) and ISO strings
    let serverTimeMs;
    if (typeof timestamp === "number") {
      serverTimeMs = timestamp;
    } else {
      // Parse ISO string or other string formats
      const parsedDate = new Date(timestamp);
      serverTimeMs = parsedDate.getTime();
    }

    // Validate the parsed time
    if (isNaN(serverTimeMs)) {
      console.warn("Invalid timestamp from server:", timestamp);
      return new Date();
    }

    // Update cache with fresh server time for use in getCurrentTime()
    serverTimeOffset = serverTimeMs - Date.now();
    lastServerTimeUpdate = Date.now();

    return new Date(serverTimeMs);
  } catch (error) {
    console.warn("Error fetching server time:", error);
    return new Date();
  }
}

// Synchronous version - uses cached offset (won't be perfect on first call)
export function getCurrentTime() {
  if (serverTimeOffset !== null) {
    return new Date(Date.now() + serverTimeOffset);
  }
  return new Date();
}

// Helper function to format date as YYYY-MM-DD using server time (local timezone)
export function formatServerDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function to get tomorrow's date based on server time
export function getTomorrowDate(serverTime) {
  const tomorrow = new Date(serverTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

// Get server time and extract hour/minute for time window checks (ALWAYS USE UTC)
export async function getServerTimeComponents() {
  const serverTime = await getServerTime();
  return {
    date: serverTime,
    hour: serverTime.getUTCHours(), // Use UTC hours, not local
    minute: serverTime.getUTCMinutes(), // Use UTC minutes, not local
    dateString: formatServerDate(serverTime),
    tomorrowString: formatServerDate(getTomorrowDate(serverTime)),
  };
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
    const serverTime = await getServerTime();
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

    const serverTime = await getServerTime();
    const tomorrow = new Date(serverTime.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const res = await fetch(`${API_URL}/daily-menu/${tomorrow}`, {
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
      (item) => item.category.toLowerCase() === categoryName.toLowerCase()
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
      (item) => item.meal_type.toLowerCase() === "breakfast"
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
      }
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
      (o) => o.date === dateStr
    );

    return filtered;
  } catch (err) {
    console.error("Error getting user orders by date:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getAllOrdersForToday() {
  try {
    const serverTime = await getServerTime();

    // Validate that serverTime is a valid Date
    if (
      !serverTime ||
      !(serverTime instanceof Date) ||
      isNaN(serverTime.getTime())
    ) {
      console.error("Invalid server time:", serverTime);
      return { error: "Failed to get valid server time" };
    }

    const today = serverTime
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
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
    const serverTime = await getServerTime();

    // Validate that serverTime is a valid Date
    if (
      !serverTime ||
      !(serverTime instanceof Date) ||
      isNaN(serverTime.getTime())
    ) {
      console.error("Invalid server time:", serverTime);
      return { error: "Failed to get valid server time" };
    }

    const tomorrow = new Date(serverTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
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
      }
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
      }
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
      }
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
