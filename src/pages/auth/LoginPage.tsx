import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types';

// const schema = yup.object({
//   email: yup.string().email('Invalid email').required('Email is required'),
//   password: yup.string().required('Password is required'),
// });

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔄 [LoginPage] useEffect triggered with isAuthenticated:', isAuthenticated);
    console.log('🔄 [LoginPage] Current location:', location);
    console.log('🔄 [LoginPage] Current auth state:', { 
      isAuthenticated, 
      user: localStorage.getItem('user'), 
      token: localStorage.getItem('token') 
    });
    
    // Terminal logging
    console.log('\n=== LOGIN PAGE USEEFFECT ===');
    console.log('🔄 useEffect triggered');
    console.log('✅ isAuthenticated:', isAuthenticated);
    console.log('📍 Current location:', location.pathname);
    console.log('👤 User in localStorage:', !!localStorage.getItem('user'));
    console.log('🔑 Token in localStorage:', !!localStorage.getItem('token'));
    
    if (isAuthenticated) {
      console.log('✅ [LoginPage] User is authenticated, redirecting...');
      const from = location.state?.from?.pathname || '/';
      console.log('🚀 [LoginPage] Redirecting to:', from);
      console.log('✅ User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
      console.log('🚀 Redirect navigate called');
    } else {
      console.log('❌ [LoginPage] User is NOT authenticated, staying on login page');
      console.log('❌ User not authenticated, staying on login page');
    }
    console.log('=== LOGIN PAGE USEEFFECT END ===\n');
  }, [isAuthenticated, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      console.log('📝 [LoginPage] Form submitted with data:', data);
      console.log('📝 [LoginPage] Current auth state before login:', { 
        isAuthenticated, 
        user: localStorage.getItem('user'), 
        token: localStorage.getItem('token') 
      });
      
      // Terminal logging
      console.log('\n=== LOGIN PAGE FORM SUBMIT ===');
      console.log('📝 Form submitted with email:', data.email);
      console.log('🔑 Password length:', data.password?.length);
      console.log('✅ Current isAuthenticated:', isAuthenticated);
      console.log('👤 Current user in localStorage:', !!localStorage.getItem('user'));
      console.log('🔑 Current token in localStorage:', !!localStorage.getItem('token'));
      
      // Basic validation
      if (!data.email || !data.password) {
        console.log('❌ [LoginPage] Validation failed: missing fields');
        setError('Please fill in all fields');
        return;
      }
      
      if (!data.email.includes('@')) {
        console.log('❌ [LoginPage] Validation failed: invalid email');
        setError('Please enter a valid email address');
        return;
      }
      
      console.log('✅ [LoginPage] Validation passed, starting login process');
      setLoading(true);
      setError('');
      
      const result = await login(data);
      console.log('✅ [LoginPage] Login successful, result:', result);
      console.log('✅ [LoginPage] Auth state after login:', { 
        isAuthenticated, 
        user: localStorage.getItem('user'), 
        token: localStorage.getItem('token') 
      });
      console.log('✅ Login successful!');
      console.log('📊 Login result:', JSON.stringify(result, null, 2));
      console.log('✅ Auth state after login:');
      console.log('👤 User in localStorage:', !!localStorage.getItem('user'));
      console.log('🔑 Token in localStorage:', !!localStorage.getItem('token'));
      console.log('✅ isAuthenticated:', isAuthenticated);
      
      // Manual redirect after successful login
      const from = location.state?.from?.pathname || '/';
      console.log('🚀 [LoginPage] Manual redirect to:', from);
      console.log('🚀 [LoginPage] About to call navigate with:', { to: from, replace: true });
      console.log('🚀 About to redirect to:', from);
      console.log('🚀 Calling navigate...');
      navigate(from, { replace: true });
      console.log('🚀 [LoginPage] Navigate called successfully');
      console.log('🚀 Navigate called successfully!');
      console.log('=== LOGIN PAGE FORM SUCCESS ===\n');
    } catch (err: any) {
      console.error('❌ [LoginPage] Login failed:', err);
      console.log('❌ LOGIN PAGE ERROR:', err);
      console.log('=== LOGIN PAGE FORM FAILED ===\n');
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8, 
          mb: 4,
          animation: 'fadeInUp 0.6s ease-out'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
            sx={{
              animation: 'fadeIn 0.8s ease-out 0.2s both',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.9)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1)'
                }
              }
            }}
          >
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
              autoComplete="email"
            />

            <TextField
              {...register('password')}
              fullWidth
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or sign in with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => window.location.href = 'https://mohamedexfs60-001-site1.mtempurl.com/api/auth/google'}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#757575',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#4285f4',
                    bgcolor: '#f8f9fa',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)'
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Facebook login will be available soon!')}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#757575',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1877f2',
                    bgcolor: '#f8f9fa',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(24, 119, 242, 0.2)'
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                Facebook
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Microsoft login will be available soon!')}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#757575',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#00a4ef',
                    bgcolor: '#f8f9fa',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 164, 239, 0.2)'
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://www.microsoft.com/favicon.ico"
                  alt="Microsoft"
                  sx={{ width: 20, height: 20, mr: 1 }}
                />
                Microsoft
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;