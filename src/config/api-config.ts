// API Configuration for different environments
export const API_CONFIG = {
  // Development API URL (localhost)
  DEVELOPMENT: 'https://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Production API URL (when backend is deployed)
  PRODUCTION: 'https://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Fallback API URL
  FALLBACK: 'https://mohamedexfs60-001-site1.mtempurl.com/api',
  
  // Get current API URL based on environment
  get CURRENT() {
    // Check if we're running on localhost (development)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return this.DEVELOPMENT;
    }
    
    // Check if we're running on GitHub Pages
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      // For GitHub Pages, we need the backend to be deployed publicly
      // For now, return localhost (user needs to run backend locally)
      return this.DEVELOPMENT;
    }
    
    // Default to development
    return this.DEVELOPMENT;
  },
  
  // Test API connection
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
    // Test development first
    if (await this.testConnection(this.DEVELOPMENT)) {
      console.log('✅ Development API is working');
      return this.DEVELOPMENT;
    }
    
    // Test production
    if (await this.testConnection(this.PRODUCTION)) {
      console.log('✅ Production API is working');
      return this.PRODUCTION;
    }
    
    // Fallback to development
    console.warn('⚠️ No API connection available, using development as fallback');
    return this.DEVELOPMENT;
  }
};

// Environment detection
export const ENVIRONMENT = {
  IS_LOCALHOST: typeof window !== 'undefined' && window.location.hostname === 'localhost',
  IS_GITHUB_PAGES: typeof window !== 'undefined' && window.location.hostname.includes('github.io'),
  IS_PRODUCTION: typeof window !== 'undefined' && !window.location.hostname.includes('localhost'),
  
  // Get current API URL
  get API_URL() {
    return API_CONFIG.CURRENT;
  }
};