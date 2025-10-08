import api from './api';
import { Course, Category, Instructor, PlatformStats } from '../types';

export interface LandingPageData {
  topCourses: Course[];
  categories: Category[];
  topInstructors: Instructor[];
  stats: PlatformStats;
}

export const landingPageService = {
  async getLandingPageData(): Promise<LandingPageData> {
    const response = await api.get<LandingPageData>('/LandingPage');
    return response.data;
  },

  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get<PlatformStats>('/LandingPage/stats');
    return response.data;
  }
};
