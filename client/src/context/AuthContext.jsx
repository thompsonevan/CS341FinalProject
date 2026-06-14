import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "../api/welltrackApi";

const AuthContext = createContext(null);
const TOKEN_KEY = "welltrack_token";
const USER_KEY = "welltrack_user";
const THEME_KEY = "welltrack_theme";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    async function hydrateUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile(token);
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, [token]);

  const login = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      token,
      user,
      theme,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      toggleTheme,
    }),
    [token, user, theme, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
