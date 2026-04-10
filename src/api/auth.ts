import api from './client';

export type LoginCredentials = {
  username: string;
  password: string;
}

export type LoginResponse = {
  access_token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
};
