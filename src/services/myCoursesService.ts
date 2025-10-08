import api from './api';
import { Course } from '../types';

export const myCoursesService = {
  async getMyCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/MyCourses');
    return response.data;
  }
};
