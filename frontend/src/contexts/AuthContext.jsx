import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        setUser(currentUser);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  async function login(payload) {
    const { user: loggedUser, token } = await authService.login(payload);
    tokenStorage.set(token);
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(payload) {
    const { user: newUser, token } = await authService.register(payload);
    tokenStorage.set(token);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  async function refreshUser() {
    const currentUser = await authService.me();
    setUser(currentUser);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook precisa ficar junto do provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
