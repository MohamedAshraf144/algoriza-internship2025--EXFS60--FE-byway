import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 [PrivateRoute] Component rendered:', {
    isAuthenticated,
    loading,
    currentPath: location.pathname,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    console.log('⏳ [PrivateRoute] Still loading, showing loading spinner');
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ [PrivateRoute] User not authenticated, redirecting to login');
    console.log('🔄 [PrivateRoute] Redirect details:', {
      to: '/login',
      from: location,
      replace: true
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ [PrivateRoute] User authenticated, rendering protected content');
  return <>{children}</>;
};

export default PrivateRoute;