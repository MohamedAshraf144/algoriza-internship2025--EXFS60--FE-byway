// API Response Types
export interface ApiResponse<T> {
  message: string;
  data: T;
  success: boolean;
}

export interface PaginatedResult<T> {
  Items: T[];
  TotalCount: number;
  Page: number;
  PageSize: number;
}

// User Types
export interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  CreatedAt: string;
}

export interface AuthResponse {
  Token: string;
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Course Types
export interface Course {
  Id: number;
  Title: string;
  Description: string;
  Price: number;
  Rating: number;
  Duration: number;
  Level: string;
  ImagePath: string;
  CategoryId: number;
  CategoryName: string;
  InstructorId: number;
  InstructorName: string;
  Requirements: string;
  LearningOutcomes: string;
  CreatedAt: string;
}

export interface CourseDetails extends Course {
  // CourseDetails extends Course which already has Requirements and LearningOutcomes
}

export interface CreateCourse {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  imagePath: string;
  categoryId: number;
  instructorId: number;
  requirements: string;
  learningOutcomes: string;
}

export interface CourseFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
}

// Category Types
export interface Category {
  Id: number;
  Name: string;
  ImagePath: string;
  CoursesCount: number;
  CreatedAt: string;
}

// Instructor Types
export interface Instructor {
  Id: number;
  Name: string;
  Bio: string;
  ImagePath: string;
  JobTitle: string;
  Rating: number;
  CreatedAt: string;
}

export interface CreateInstructor {
  name: string;
  bio: string;
  imagePath: string;
  jobTitle: string;
}

// Cart Types
export interface CartItem {
  Id: number;
  CourseId: number;
  CourseTitle: string;
  CourseImage: string;
  CoursePrice: number;
  InstructorName: string;
  Duration: number;
  AddedAt: string;
}

export interface Cart {
  Id: number;
  UserId: number;
  Items: CartItem[];
  TotalPrice: number;
  TaxAmount: number;
  FinalTotal: number;
  ItemsCount: number;
}

// Order Types
export interface Order {
  Id: number;
  UserId: number;
  OrderDate: string;
  TotalAmount: number;
  TaxAmount: number;
  FinalAmount: number;
  Status: string;
  PaymentMethod: string;
  Notes: string;
  Items?: OrderItem[];
}

export interface OrderItem {
  Id: number;
  CourseId: number;
  CourseTitle: string;
  CourseImage: string;
  Price: number;
  InstructorName: string;
  Duration: number;
  Level: string;
  Rating: number;
  CategoryName: string;
}

export interface CreateOrder {
  userId: number;
  paymentMethod: string;
  notes?: string;
}

// Filter Types
export interface CourseFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

// Dashboard Stats
export interface PlatformStats {
  TotalUsers: number;
  TotalCourses: number;
  TotalInstructors: number;
  TotalCategories: number;
  TotalOrders: number;
  MonthlyRevenue: number;
}