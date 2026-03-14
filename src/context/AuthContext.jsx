import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, generateToken, deleteUser, addPointsToUser } from '../utils/crypto';

const AuthContext = createContext(null);

const SESSION_KEY  = 'gfg_session_token';
const USER_KEY     = 'gfg_session_user';
const REMEMBER_KEY = 'gfg_remember_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [loading, setLoading]           = useState(true); // restoring session

  // Restore session on mount
  useEffect(() => {
    try {
      const token    = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      const userJson = sessionStorage.getItem(USER_KEY)    || localStorage.getItem(USER_KEY);
      if (token && userJson) {
        setCurrentUser(JSON.parse(userJson));
      }
    } catch {
      // corrupted session — clear it
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (regNo, password, rememberMe = false) => {
    const user  = await loginUser(regNo, password); // throws on failure
    const token = generateToken();

    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
    if (rememberMe) localStorage.setItem(REMEMBER_KEY, regNo);

    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!currentUser) return;
    try {
      await deleteUser(currentUser.regNo);
      logout();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete account");
    }
  }, [currentUser, logout]);

  const addPoints = useCallback(async (amount) => {
    if (!currentUser) return;
    try {
      const updatedUser = await addPointsToUser(currentUser.regNo, amount);
      
      // Update session/local storage depending on where current user lives
      if (sessionStorage.getItem(USER_KEY)) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      } else if (localStorage.getItem(USER_KEY)) {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Failed to add points:', err);
      throw new Error(err.message || "Failed to add points");
    }
  }, [currentUser]);

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout, deleteAccount, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
