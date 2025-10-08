import React, { useState } from 'react';
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';

// const schema = yup.object({
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   password: yup
//     .string()
//     .min(6, 'Password must be at least 6 characters')
//     .required('Password is required'),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref('password')], 'Passwords must match')
//     .required('Confirm password is required'),
// });

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('📝 Register form submitted with:', data);
      
      // Basic validation
      if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (!data.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (data.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setLoading(true);
      setError('');

      const { confirmPassword, ...registerData } = data;

      // Register user (auto-login is handled in authService)
      await registerUser(registerData);

      // Navigate to home page after successful registration
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('❌ Register failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
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
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('firstName')}
              fullWidth
              label="First Name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              margin="normal"
              autoComplete="given-name"
            />

            <TextField
              {...register('lastName')}
              fullWidth
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              margin="normal"
              autoComplete="family-name"
            />

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
              autoComplete="new-password"
            />

            <TextField
              {...register('confirmPassword')}
              fullWidth
              label="Confirm Password"
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              margin="normal"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or sign up with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => window.location.href = 'http://mohamedexfs60-001-site1.mtempurl.com/api/auth/google'}
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
                onClick={() => alert('Facebook registration will be available soon!')}
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
                onClick={() => alert('Microsoft registration will be available soon!')}
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
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;