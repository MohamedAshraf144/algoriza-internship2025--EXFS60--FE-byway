import api from './api';
import { AuthResponse } from '../types';

export const socialAuthService = {
  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', {
      token: googleToken
    });
    return response.data;
  },

  async loginWithFacebook(facebookToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/facebook', {
      token: facebookToken
    });
    return response.data;
  },

  async registerWithGoogle(googleToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google/register', {
      token: googleToken
    });
    return response.data;
  },

  async registerWithFacebook(facebookToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/facebook/register', {
      token: facebookToken
    });
    return response.data;
  }
};
