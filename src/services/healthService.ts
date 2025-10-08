import api from './api';

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export const healthService = {
  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  }
};
