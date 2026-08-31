import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, LoginPayload, RegisterPayload } from '../services/auth.service';
import { tokenStorage } from '../services/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  async function login(payload: LoginPayload): Promise<User> {
    const { user: loggedUser, token } = await authService.login(payload);
    tokenStorage.set(token);
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(payload: RegisterPayload): Promise<User> {
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
