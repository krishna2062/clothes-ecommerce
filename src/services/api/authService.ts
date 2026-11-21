import { apiRequest, setStoredTokens, clearStoredTokens } from './apiClient';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  user: {
    id: string;
    email: string;
    phoneNumber?: string;
    userType: string;
    fullName?: string;
    roles: string[];
  };
}

export const authService = {
  async login(emailOrPhone: string, password?: string): Promise<AuthResponse | null> {
    try {
      const res = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          emailOrPhone,
          password: password || 'Admin123!',
        }),
      });

      if (res.success && res.data?.accessToken) {
        setStoredTokens(res.data.accessToken, res.data.refreshToken);
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async register(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    accountType?: string;
  }): Promise<AuthResponse | null> {
    try {
      const res = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password || 'Password123!',
          userType: data.accountType || 'Customer',
        }),
      });

      if (res.success && res.data?.accessToken) {
        setStoredTokens(res.data.accessToken, res.data.refreshToken);
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  logout() {
    clearStoredTokens();
  },
};
