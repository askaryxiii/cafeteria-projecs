const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

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
function getNextMonday(from = new Date()) {
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
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }

    // compute next monday
    const nextMonday = getNextMonday(new Date());
    const dateStr = formatDateYYYYMMDD(nextMonday);

    const res = await fetch(`${API_URL}/weekly-menu/${dateStr}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const res = await fetch(`${API_URL}/daily-menu/${tomorrow}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }
    const res = await fetch(`${API_URL}/menu`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: { Authorization: `Bearer ${t}` },
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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
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
  const today = new Date()
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-");
  const token = readToken();

  try {
    const res = await fetch(`${API_URL}/orders/all/${today}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Failed to fetch orders" };
    }

    const data = await res.json();
    // Extract breakfast and lunch orders
    const breakfastOrders = data.breakfastOrders || [];
    const lunchOrders = data.lunchOrders || [];

    return { breakfastOrders, lunchOrders };
  } catch (err) {
    console.error("Error fetching today's orders:", err);
    return { error: err.message || "Something went wrong" };
  }
}

export async function getChefOrders() {
  const token = readToken();

  try {
    const res = await fetch(`${API_URL}/chef/orders/today`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!verifyRes.ok) {
      const errBody = await verifyRes.json().catch(() => ({}));
      return { error: errBody.message || "Token verification failed" };
    }
    const res = await fetch(
      `${API_URL}/orders/${userId}?from=${from}&to=${to}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
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
      headers: {
        Authorization: `Bearer ${t}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
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
      headers: {
        Authorization: `Bearer ${t}`,
      },
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
