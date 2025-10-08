// API Configuration
export const API_CONFIG = {
  // Production API URL
  BASE_URL: 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Development API URL (for local testing)
  DEV_BASE_URL: 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Current environment
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Get the appropriate base URL
  get BASE_URL_CURRENT() {
    return this.IS_PRODUCTION ? this.BASE_URL : this.DEV_BASE_URL;
  }
};

// Endpoints configuration
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    GOOGLE: '/Auth/google',
    GOOGLE_CALLBACK: '/Auth/google-callback'
  },
  
  // Admin Setup
  ADMIN_SETUP: {
    CREATE_ADMIN: '/AdminSetup/create-admin',
    CHECK_ADMIN: '/AdminSetup/check-admin',
    DELETE_ADMIN: '/AdminSetup/delete-admin'
  },
  
  // Admin Operations
  ADMIN: {
    STATS: '/Admin/stats',
    USERS: '/Admin/users',
    ORDERS: '/Admin/orders'
  },
  
  // Courses
  COURSES: {
    BASE: '/Courses',
    SEARCH: '/Courses/search',
    TOP: '/Courses/top',
    SIMILAR: '/Courses/{id}/similar'
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/Categories',
    SEED: '/Categories/seed'
  },
  
  // Instructors
  INSTRUCTORS: {
    BASE: '/Instructors'
  },
  
  // Cart
  CART: {
    BASE: '/Cart',
    ADD: '/Cart/add',
    REMOVE: '/Cart/remove',
    CLEAR: '/Cart/clear'
  },
  
  // Orders
  ORDERS: {
    BASE: '/Orders'
  },
  
  // Landing Page
  LANDING_PAGE: {
    BASE: '/LandingPage',
    STATS: '/LandingPage/stats'
  },
  
  // My Courses
  MY_COURSES: {
    BASE: '/MyCourses'
  },
  
  // Email
  EMAIL: {
    WELCOME: '/Email/welcome'
  },
  
  // Health
  HEALTH: {
    BASE: '/health'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
