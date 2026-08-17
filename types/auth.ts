export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    authorization: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
    };
  };
}