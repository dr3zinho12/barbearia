import { User } from '../types';
import { api } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async updateProfile(payload: { name?: string; phone?: string }): Promise<User> {
    const { data } = await api.put<User>('/auth/me', payload);
    return data;
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/auth/me/password', payload);
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(payload: { token: string; newPassword: string }): Promise<void> {
    await api.post('/auth/reset-password', payload);
  },
};
