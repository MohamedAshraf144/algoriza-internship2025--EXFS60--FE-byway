// Environment Configuration
export const ENVIRONMENT = {
  // API URLs
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  DEV_API_BASE_URL: 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '773413143299-g7q27cs6du7g28nr9a9rfe31b7c4brjn.apps.googleusercontent.com',
  
  // App Configuration
  APP_NAME: 'Byway Learning Platform',
  APP_VERSION: '1.0.0',
  
  // Get current API URL
  get CURRENT_API_URL() {
    return this.IS_PRODUCTION ? this.API_BASE_URL : this.DEV_API_BASE_URL;
  }
};

// Logging configuration
export const LOGGING = {
  ENABLED: true,
  LEVEL: ENVIRONMENT.IS_PRODUCTION ? 'error' : 'debug',
  
  // Log levels
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Feature flags
export const FEATURES = {
  GOOGLE_OAUTH: true,
  EMAIL_NOTIFICATIONS: true,
  CART_ANIMATION: true,
  DEBUG_MODE: !ENVIRONMENT.IS_PRODUCTION
};
