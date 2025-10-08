import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const GoogleSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const firstName = searchParams.get('firstName');
        const lastName = searchParams.get('lastName');
        const role = searchParams.get('role');

        if (!token || !userId || !email) {
          throw new Error('Missing authentication data');
        }

        // Store the authentication data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: parseInt(userId),
          firstName,
          lastName,
          email,
          role
        }));

        // Update auth context
        await login({
          email,
          password: '' // Not needed for Google auth
        });

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Google authentication error:', error);
        // Redirect to login page with error
        navigate('/login?error=google_auth_failed', { replace: true });
      }
    };

    handleGoogleAuth();
  }, [searchParams, navigate, login]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h5" color="primary">
        Completing Google Authentication...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we sign you in
      </Typography>
    </Box>
  );
};

export default GoogleSuccessPage;

