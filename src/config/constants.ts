// API Constants
export const API_CONSTANTS = {
  // Production API URL
  PRODUCTION_API_URL: 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Development API URL
  DEVELOPMENT_API_URL: 'http://localhost:5145/api',
  
  // Current API URL based on environment
  get CURRENT_API_URL() {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      return this.DEVELOPMENT_API_URL;
    }
    
    // Use production for all other cases
    return this.PRODUCTION_API_URL;
  },
  
  // API Timeout
  TIMEOUT: 10000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// Environment detection
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Get current API URL
  get API_URL() {
    return API_CONSTANTS.CURRENT_API_URL;
  }
};
