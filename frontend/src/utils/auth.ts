export const authUtils = {
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('organizze_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('organizze_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('organizze_token', token);
  },

  clearToken: (): void => {
    localStorage.removeItem('organizze_token');
  },

  redirectToLogin: (): void => {
    window.location.href = '/';
  }
};