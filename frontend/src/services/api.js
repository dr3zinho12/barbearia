import axios from 'axios';

const TOKEN_KEY = '@black-blue-barber:token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function extractErrorMessage(error, fallback = 'Ocorreu um erro inesperado. Tente novamente.') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors?.length) {
      return data.errors.map((issue) => issue.message).join(' ');
    }
    if (data?.message) {
      return data.message;
    }
  }
  return fallback;
}
