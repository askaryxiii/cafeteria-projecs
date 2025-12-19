import React, { createContext, useState, useEffect, useRef } from "react";
import { clearVerifiedUserCache, getCurrentTime } from "../lib/apis";

const API_BASE = import.meta.env.VITE_API_BASE;

export const AuthContext = createContext();

// No local JWT parsing — rely on server `/auth/verify-token` for user info.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      // try persistent first
      const raw =
        localStorage.getItem("auth") || sessionStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const timerRef = useRef(null);

  // schedule logout when token expires
  const scheduleLogout = (expiresAt) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const ms = expiresAt - Date.now();
    if (ms <= 0) {
      logout();
      return;
    }
    timerRef.current = setTimeout(() => {
      logout();
    }, ms);
  };

  useEffect(() => {
    // if we have a user object with expiry, ensure logout is scheduled
    if (user && user.expiresAt) {
      scheduleLogout(user.expiresAt);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // verify token with backend and refresh local user info
  const verifyToken = async (token) => {
    const apiUrl = `${API_BASE}/auth/verify-token`;

    try {
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const contentType = res.headers.get("content-type");

      // Read the body ONCE into a variable
      const responseText = await res.text();

      if (!res.ok) {
        console.error("❌ Token verification failed - status:", res.status);
        console.error("Error response:", responseText);
        throw new Error(
          `Token verification failed: ${res.status} - ${responseText.substring(
            0,
            100
          )}`
        );
      }

      // Check if response is actually JSON (not HTML error page)
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Expected JSON but got:", contentType);
        console.error("Response was:", responseText);
        throw new Error(
          `Expected JSON response but got ${contentType}. Is the API endpoint correct? Response: ${responseText.substring(
            0,
            100
          )}`
        );
      }

      // Try to parse the already-read response as JSON
      try {
        const data = JSON.parse(responseText);

        return data;
      } catch (parseError) {
        console.error("❌ Failed to parse as JSON:", parseError.message);
        console.error("Response text was:", responseText.substring(0, 200));
        throw new Error(
          `Server response is not valid JSON. Response: ${responseText.substring(
            0,
            100
          )}`
        );
      }
    } catch (fetchError) {
      console.error("❌ Fetch error:", fetchError);
      throw fetchError;
    }
  };

  // login(email,password, remember:boolean)
  const login = async ({ email, password }, remember = false) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    const data = await res.json();
    const token = data.token;
    if (!token) throw new Error("No token returned from server");

    // verify token and obtain authoritative user info from server
    const verifyRes = await verifyToken(token);
    // backend may optionally include expiry info; try common locations
    const expiresAt =
      (verifyRes && (verifyRes.expiresAt || verifyRes.user?.exp)) ||
      getCurrentTime().getTime() + 7 * 24 * 3600 * 1000;

    // persist token depending on remember flag
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("authToken", token);
    // token changed — clear any cached verified user
    try {
      clearVerifiedUserCache();
    } catch (e) {
      // ignore
    }

    // get user info from verifyRes (don't call twice)
    const userInfo = verifyRes && verifyRes.user ? verifyRes.user : verifyRes;

    const auth = { token, user: userInfo, expiresAt };
    storage.setItem("auth", JSON.stringify(auth));
    // clear the other storage to avoid ambiguity
    if (remember) sessionStorage.removeItem("auth");
    else localStorage.removeItem("auth");

    setUser(auth);
    return auth;
  };

  const register = async ({
    name,
    email,
    password,
    role = "employee",
    arabic_name,
  }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ name, email, password, role, arabic_name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }
    const data = await res.json();
    // backend may return just { message: 'User created' }
    // or may return token; in registration case we don't auto-login by default
    return data;
  };

  const logout = () => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("authToken");
    } catch (e) {
      // ignore
    }
    try {
      clearVerifiedUserCache();
    } catch (e) {
      // ignore
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setUser(null);
  };

  // on mount: if there's an auth token, verify it and populate user state
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const raw =
          localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.token) return logout();
        // verify with backend
        const userInfo = await verifyToken(parsed.token);
        const userObj = userInfo && userInfo.user ? userInfo.user : userInfo;
        const auth = {
          token: parsed.token,
          user: userObj,
          expiresAt: parsed.expiresAt,
        };
        if (!mounted) return;
        setUser(auth);
      } catch (e) {
        logout();
      }
    };
    init();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
