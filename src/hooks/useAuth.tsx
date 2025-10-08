import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/authService';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      console.log('🔄 Initializing auth...');
      console.log('\n=== AUTH INITIALIZATION ===');
      
      // Clear any invalid data first
      authService.clearInvalidData();
      
      const token = authService.getToken();
      console.log('🔑 Token from localStorage:', token);
      console.log('🔑 Token exists:', !!token);
      
      if (token) {
        const currentUser = authService.getCurrentUser();
        console.log('👤 Current user from localStorage:', currentUser);
        console.log('👤 User exists:', !!currentUser);
        console.log('👤 User ID:', currentUser?.Id);
        
        if (currentUser && currentUser.Id) {
          console.log('✅ Setting user from localStorage:', currentUser);
          setUser(currentUser);
          console.log('✅ User set successfully');
        } else {
          console.log('❌ No user found in localStorage or no user ID, clearing token');
          authService.logout();
          setUser(null);
        }
      } else {
        console.log('❌ No token found in localStorage');
        setUser(null);
      }
      setLoading(false);
      console.log('=== AUTH INITIALIZATION COMPLETE ===\n');
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('🔐 [useAuth] Login function called with credentials:', credentials);
      console.log('🔐 [useAuth] Current state before login:', {
        user: user,
        isAuthenticated: !!user && !!authService.getToken(),
        token: authService.getToken(),
        localStorageUser: authService.getCurrentUser()
      });
      
      // Terminal logging
      console.log('\n=== USE AUTH LOGIN START ===');
      console.log('🔐 useAuth login called');
      console.log('👤 Current user state:', user);
      console.log('🔑 Current token exists:', !!authService.getToken());
      console.log('✅ Current isAuthenticated:', !!user && !!authService.getToken());
      
      const response = await authService.login(credentials);
      console.log('✅ [useAuth] Received response from authService:', response);
      console.log('✅ Received response from authService');
      console.log('📊 Response data:', JSON.stringify(response, null, 2));
      
      const userData = {
        Id: response.UserId,
        FirstName: response.FirstName,
        LastName: response.LastName,
        Email: response.Email,
        Role: response.Role,
        CreatedAt: new Date().toISOString()
      };
      
      console.log('👤 [useAuth] Prepared user data:', userData);
      console.log('👤 [useAuth] About to call setUser with:', userData);
      console.log('👤 Preparing user data:', userData);
      console.log('👤 About to call setUser...');
      
      setUser(userData);
      console.log('👤 setUser called with:', userData);
      
      console.log('🔄 [useAuth] setUser called, checking state after:');
      console.log('🔄 [useAuth] - user state:', userData);
      console.log('🔄 [useAuth] - token from localStorage:', authService.getToken());
      console.log('🔄 [useAuth] - user from localStorage:', authService.getCurrentUser());
      console.log('🔄 [useAuth] - isAuthenticated calculation:', !!userData && !!authService.getToken());
      
      // Force a small delay to see state changes
      setTimeout(() => {
        console.log('⏰ [useAuth] State check after 100ms:');
        console.log('⏰ [useAuth] - Current user state:', user);
        console.log('⏰ [useAuth] - Current token:', authService.getToken());
        console.log('⏰ [useAuth] - Current isAuthenticated:', !!user && !!authService.getToken());
      }, 100);
      
      console.log('🔄 State after login:');
      console.log('🔄 - User data:', userData);
      console.log('🔄 - Token exists:', !!authService.getToken());
      console.log('🔄 - isAuthenticated should be:', !!userData && !!authService.getToken());
      console.log('=== USE AUTH LOGIN SUCCESS ===\n');
      
      return response;
    } catch (error) {
      console.error('❌ [useAuth] Login error:', error);
      console.log('❌ USE AUTH LOGIN ERROR:', error);
      console.log('=== USE AUTH LOGIN FAILED ===\n');
      throw error;
    }
  }, [user]);

  const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.register(userData);
      const newUserData = {
        Id: response.UserId,
        FirstName: response.FirstName,
        LastName: response.LastName,
        Email: response.Email,
        Role: response.Role,
        CreatedAt: new Date().toISOString()
      };
      setUser(newUserData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = !!user && !!authService.getToken();
  const isAdmin = user?.Role === 'Admin';
  
  // Enhanced debug logging
  console.log('🔍 [useAuth] Auth state calculation:', {
    user: user,
    userExists: !!user,
    token: authService.getToken(),
    tokenExists: !!authService.getToken(),
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    loading: loading,
    localStorageUser: authService.getCurrentUser(),
    localStorageToken: authService.getToken(),
    timestamp: new Date().toISOString()
  });
  
  // Terminal logging for auth state
  console.log('🔍 AUTH STATE UPDATE:');
  console.log('👤 User exists:', !!user);
  console.log('🔑 Token exists:', !!authService.getToken());
  console.log('✅ isAuthenticated:', isAuthenticated);
  console.log('👑 isAdmin:', isAdmin);
  console.log('⏳ Loading:', loading);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};