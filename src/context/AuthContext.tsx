import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { login as loginApi } from '../api/auth';
import { AUTH_CONFIG } from '../config';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  }, []);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    if (now - lastActivityRef.current < AUTH_CONFIG.throttleDelay) return;
    lastActivityRef.current = now;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, AUTH_CONFIG.inactivityTimeout);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    resetTimer();

    ACTIVITY_EVENTS.forEach((event) => globalThis.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => globalThis.removeEventListener(event, resetTimer));
    };
  }, [token, resetTimer]);

  const login = async (username: string, password: string) => {
    const response = await loginApi({ username, password });
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('username', username);
    setToken(response.access_token);
    setUsername(username);
  };

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
