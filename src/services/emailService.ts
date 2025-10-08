import api from './api';

export interface WelcomeEmailRequest {
  email: string;
  name: string;
}

export const emailService = {
  async sendWelcomeEmail(data: WelcomeEmailRequest): Promise<any> {
    const response = await api.post('/Email/welcome', data);
    return response.data;
  }
};