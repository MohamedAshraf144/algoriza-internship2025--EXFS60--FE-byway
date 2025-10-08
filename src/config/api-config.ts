// API Configuration with fallback
export const API_CONFIG = {
  // Production API URL
  PRODUCTION: 'http://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Development API URL
  DEVELOPMENT: 'http://localhost:5145/api',
  
  // Fallback API URL (if production fails)
  FALLBACK: 'http://localhost:5145/api',
  
  // Current environment
  get CURRENT() {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      return this.DEVELOPMENT;
    }
    
    // Try production first, fallback to local if needed
    return this.PRODUCTION;
  },
  
  // Test if API is available
  async testConnection(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn(`API connection test failed for ${url}:`, error);
      return false;
    }
  },
  
  // Get working API URL
  async getWorkingUrl(): Promise<string> {
    // Test production first
    if (await this.testConnection(this.PRODUCTION)) {
      console.log('✅ Production API is working');
      return this.PRODUCTION;
    }
    
    // Test development
    if (await this.testConnection(this.DEVELOPMENT)) {
      console.log('✅ Development API is working');
      return this.DEVELOPMENT;
    }
    
    // Fallback to production (will show errors but at least tries)
    console.warn('⚠️ No API connection available, using production as fallback');
    return this.PRODUCTION;
  }
};

// Environment detection
export const ENVIRONMENT = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Get current API URL
  get API_URL() {
    return API_CONFIG.CURRENT;
  }
};
