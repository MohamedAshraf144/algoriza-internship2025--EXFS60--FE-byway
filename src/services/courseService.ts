import api from './api';
import { Course, CourseDetails, CreateCourse, PaginatedResult, CourseFilters } from '../types';

export const courseService = {
  async getCourses(filters: CourseFilters = {}): Promise<PaginatedResult<Course>> {
    console.log('🔍 [courseService] getCourses called with filters:', filters);
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const url = `/Courses?${params.toString()}`;
    console.log('🔍 [courseService] Making request to:', url);
    const response = await api.get<PaginatedResult<Course>>(url);
    console.log('🔍 [courseService] Response received:', response.data);
    return response.data;
  },

  async getCourseById(id: number): Promise<CourseDetails> {
    const response = await api.get<CourseDetails>(`/Courses/${id}`);
    return response.data;
  },

  async getTopCourses(count: number = 6): Promise<Course[]> {
    console.log('🔍 [courseService] Fetching top courses...');
    const response = await api.get<Course[]>(`/Courses/top?count=${count}`);
    console.log('🔍 [courseService] Top courses response:', response.data);
    return response.data;
  },

  async getSimilarCourses(courseId: number, count: number = 4): Promise<Course[]> {
    const response = await api.get<Course[]>(`/Courses/${courseId}/similar?count=${count}`);
    return response.data;
  },

  async searchCourses(query: string, filters: any = {}): Promise<Course[]> {
    const params = new URLSearchParams();
    params.append('query', query);
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.level) params.append('level', filters.level);
    
    const response = await api.get<Course[]>(`/Courses/search?${params.toString()}`);
    return response.data;
  },

  async createCourse(course: CreateCourse): Promise<Course> {
    const response = await api.post<Course>('/Courses', course);
    return response.data;
  },

  async updateCourse(id: number, course: Partial<CreateCourse>): Promise<Course> {
    const response = await api.put<Course>(`/Courses/${id}`, course);
    return response.data;
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/Courses/${id}`);
  }
};