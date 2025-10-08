import api from './api';
import { Instructor, CreateInstructor, PaginatedResult } from '../types';

export const instructorService = {
  async getInstructors(page: number = 1, pageSize: number = 10, search: string = '', sortBy: string = 'name'): Promise<PaginatedResult<Instructor>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);

    const url = `/Instructors?${params.toString()}`;
    console.log('🌐 [instructorService] Making API call to:', url);
    
    try {
      const response = await api.get<PaginatedResult<Instructor>>(url);
      console.log('✅ [instructorService] API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [instructorService] API error:', error);
      throw error;
    }
  },

  async getInstructorById(id: number): Promise<Instructor> {
    const response = await api.get<Instructor>(`/Instructors/${id}`);
    return response.data;
  },

  async createInstructor(instructor: CreateInstructor): Promise<Instructor> {
    const response = await api.post<Instructor>('/Instructors', instructor);
    return response.data;
  },

  async updateInstructor(id: number, instructor: Partial<CreateInstructor>): Promise<Instructor> {
    const response = await api.put<Instructor>(`/Instructors/${id}`, instructor);
    return response.data;
  },

  async deleteInstructor(id: number): Promise<void> {
    await api.delete(`/Instructors/${id}`);
  }
};
