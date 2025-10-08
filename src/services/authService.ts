import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

// Extend window interface for debugging
declare global {
  interface Window {
    loginDebug?: {
      success: boolean;
      response?: any;
      error?: any;
      localStorage?: any;
      timestamp: string;
    };
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 [authService] Login attempt started with credentials:', credentials);
    console.log('🔐 [authService] Current localStorage state before login:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    });
    
    // Terminal logging
    console.log('\n=== AUTH SERVICE LOGIN START ===');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password length:', credentials.password?.length);
    console.log('💾 Current token exists:', !!localStorage.getItem('token'));
    console.log('👤 Current user exists:', !!localStorage.getItem('user'));
    
    try {
      console.log('🌐 [authService] Making API call to: /Auth/login');
      console.log('🌐 Making API call to backend...');
      const response = await api.post<AuthResponse>('/Auth/login', credentials);
      console.log('✅ [authService] API response received:', {
        status: response.status,
        data: response.data
      });
      console.log('✅ API Response Status:', response.status);
      console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));

      // Store token and user info in localStorage
      console.log('💾 [authService] Storing data in localStorage...');
      console.log('💾 Storing token and user data...');
      
      // The backend sends AuthResponseDto directly, not wrapped in a data object
      const authData = response.data;
      
      // Validate response data before storing
      if (!authData.Token) {
        console.error('❌ [authService] No token in response data');
        console.error('❌ [authService] Response data keys:', Object.keys(authData));
        throw new Error('No token received from server');
      }

      if (!authData.UserId) {
        console.error('❌ [authService] No userId in response data');
        console.error('❌ [authService] Response data keys:', Object.keys(authData));
        throw new Error('No userId received from server');
      }

      console.log('💾 Token to store:', authData.Token);
      console.log('💾 UserId to store:', authData.UserId);

      localStorage.setItem('token', authData.Token);
      localStorage.setItem('user', JSON.stringify({
        Id: authData.UserId,
        FirstName: authData.FirstName,
        LastName: authData.LastName,
        Email: authData.Email,
        Role: authData.Role
      }));

      console.log('💾 [authService] Data stored in localStorage:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        tokenLength: localStorage.getItem('token')?.length,
        userLength: localStorage.getItem('user')?.length
      });
      console.log('💾 Token stored:', !!localStorage.getItem('token'));
      console.log('💾 User stored:', !!localStorage.getItem('user'));
      console.log('💾 Token length:', localStorage.getItem('token')?.length);
      console.log('💾 User data:', localStorage.getItem('user'));
      
      // Verify the data was stored correctly
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('🔍 [authService] Verification of stored data:', {
        tokenExists: !!storedToken,
        userExists: !!storedUser,
        tokenValid: storedToken && storedToken.length > 0,
        userValid: storedUser && storedUser.length > 0
      });
      
      // Also log to window for persistence
      (window as any).loginDebug = {
        success: true,
        response: response.data,
        localStorage: {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        },
        timestamp: new Date().toISOString()
      };
      console.log('🔍 [authService] Login debug info saved to window.loginDebug');

      console.log('✅ [authService] Login process completed successfully');
      console.log('=== AUTH SERVICE LOGIN SUCCESS ===\n');
      return response.data;
    } catch (error) {
      console.error('❌ [authService] Login error occurred:', error);
      console.log('❌ LOGIN ERROR:', error);
      console.log('=== AUTH SERVICE LOGIN FAILED ===\n');
      
      // Also log error to window for persistence
      (window as any).loginDebug = {
        success: false,
        error: error,
        timestamp: new Date().toISOString()
      };
      console.log('🔍 [authService] Login error saved to window.loginDebug');
      
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 Attempting register with:', userData);
    
    try {
      console.log('🌐 Making API call to:', '/Auth/register');
      const response = await api.post<AuthResponse>('/Auth/register', userData);
      console.log('✅ Register response status:', response.status);
      console.log('✅ Register response data:', response.data);

      // Store token and user info in localStorage
      const authData = response.data;
      localStorage.setItem('token', authData.Token);
      localStorage.setItem('user', JSON.stringify({
        Id: authData.UserId,
        FirstName: authData.FirstName,
        LastName: authData.LastName,
        Email: authData.Email,
        Role: authData.Role
      }));

      console.log('💾 Saved to localStorage:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      });

      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },

  logout(): void {
    console.log('🚪 [authService] Logging out, clearing localStorage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  clearInvalidData(): void {
    console.log('🧹 [authService] Clearing invalid data from localStorage');
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🧹 [authService] Current localStorage state:', {
      token: token,
      user: user,
      tokenType: typeof token,
      userType: typeof user
    });
    
    if (token === 'undefined' || token === 'null' || !token) {
      console.log('🧹 [authService] Removing invalid token');
      localStorage.removeItem('token');
    }
    
    if (user === '{}' || user === 'null' || user === 'undefined' || !user) {
      console.log('🧹 [authService] Removing invalid user data');
      localStorage.removeItem('user');
    }
    
    console.log('🧹 [authService] localStorage cleaned');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    console.log('👤 [authService] getCurrentUser called:', {
      userStr: userStr,
      userStrExists: !!userStr,
      userStrLength: userStr?.length
    });
    
    if (!userStr || userStr === '{}' || userStr === 'null' || userStr === 'undefined') {
      console.log('👤 [authService] No valid user string in localStorage');
      return null;
    }
    
    try {
      const result = JSON.parse(userStr);
      console.log('👤 [authService] getCurrentUser result:', result);
      
      // Backward compatibility: support both camelCase and PascalCase
      const userId = result?.Id || result?.id;
      const firstName = result?.FirstName || result?.firstName;
      const lastName = result?.LastName || result?.lastName;
      const email = result?.Email || result?.email;
      const role = result?.Role || result?.role;
      
      console.log('👤 [authService] User ID:', userId);
      console.log('👤 [authService] User ID exists:', !!userId);
      
      // Check if user object is empty or has no ID
      if (!result || !userId) {
        console.log('👤 [authService] User object is empty or has no ID');
        return null;
      }
      
      // Return normalized user object with PascalCase
      return {
        Id: userId,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Role: role,
        CreatedAt: result?.CreatedAt || result?.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [authService] Error parsing user from localStorage:', error);
      return null;
    }
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🔑 [authService] getToken called:', {
      token: token,
      tokenExists: !!token,
      tokenLength: token?.length
    });
    
    // Check if token is "undefined" string and return null
    if (token === 'undefined' || token === 'null' || !token) {
      console.log('🔑 [authService] Invalid token found, returning null');
      return null;
    }
    
    return token;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const result = !!token;
    console.log('🔍 [authService] isAuthenticated called:', {
      token: token,
      result: result
    });
    return result;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    const result = user?.Role === 'Admin';
    console.log('👑 [authService] isAdmin called:', {
      user: user,
      userRole: user?.Role,
      result: result
    });
    return result;
  }
};