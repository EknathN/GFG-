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
      
      console.log('AuthContext: Checking for stored session...', { hasToken: !!token, hasUser: !!userJson });
      if (token && userJson) {
        const user = JSON.parse(userJson);
        console.log('AuthContext: Session found for:', user.regNo, 'Role:', user.role);
        setCurrentUser(user);
      } else {
        console.log('AuthContext: No session found.');
      }
    } catch (e) {
      console.error('AuthContext: Session restoration failed', e);
      sessionStorage.clear();
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
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
  
  const updateUser = useCallback(async (updates) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      
      // Update storage
      const store = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
      store.setItem(USER_KEY, JSON.stringify(updatedUser));
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [currentUser]);

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout, deleteAccount, addPoints, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
