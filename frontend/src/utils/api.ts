import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('organizze_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('organizze_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: (token: string) => {
    localStorage.setItem('organizze_token', token);
    return Promise.resolve();
  },
  
  logout: () => {
    localStorage.removeItem('organizze_token');
  },

  // API calls
  getAccounts: () => api.get('/api/accounts'),
  getTransactions: (page = 1, perPage = 50) => 
    api.get(`/api/transactions?page=${page}&per_page=${perPage}`),
  getCategories: () => api.get('/api/categories'),
  
  // Health check
  healthCheck: () => api.get('/health'),
};