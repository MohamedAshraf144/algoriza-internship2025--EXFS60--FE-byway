import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Import pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GoogleSuccessPage from './pages/auth/GoogleSuccessPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import MyCoursesPage from './pages/courses/MyCoursesPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/cart/CheckoutPage';
import PaymentSuccessPage from './pages/cart/PaymentSuccessPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Import components
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#5a6fd8',
      light: '#8b9cf0',
    },
    secondary: {
      main: '#764ba2',
      dark: '#6a4190',
      light: '#8a5fb8',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔍 [AppRoutes] Component rendered with auth state:', { 
    isAuthenticated, 
    loading,
    timestamp: new Date().toISOString()
  });

  // Terminal logging
  console.log('\n=== APP ROUTES RENDER ===');
  console.log('🔍 AppRoutes component rendered');
  console.log('✅ isAuthenticated:', isAuthenticated);
  console.log('⏳ loading:', loading);
  console.log('👤 User in localStorage:', !!localStorage.getItem('user'));
  console.log('🔑 Token in localStorage:', !!localStorage.getItem('token'));

  if (loading) {
    console.log('⏳ [AppRoutes] Still loading, showing loading screen');
    console.log('⏳ Still loading, showing loading screen');
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/my-courses" element={<PrivateRoute><MyCoursesPage /></PrivateRoute>} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            (() => {
              console.log('🛣️ [AppRoutes] /login route evaluation:', { isAuthenticated });
              console.log('\n=== LOGIN ROUTE EVALUATION ===');
              console.log('🛣️ Evaluating /login route');
              console.log('✅ isAuthenticated:', isAuthenticated);
              console.log('👤 User in localStorage:', !!localStorage.getItem('user'));
              console.log('🔑 Token in localStorage:', !!localStorage.getItem('token'));
              
              if (isAuthenticated) {
                console.log('🛣️ [AppRoutes] User authenticated, redirecting from /login to /');
                console.log('✅ User authenticated, redirecting to home page');
                console.log('=== LOGIN ROUTE REDIRECT ===\n');
                return <Navigate to="/" />;
              } else {
                console.log('🛣️ [AppRoutes] User not authenticated, showing LoginPage');
                console.log('❌ User not authenticated, showing LoginPage');
                console.log('=== LOGIN ROUTE SHOW PAGE ===\n');
                return <LoginPage />;
              }
            })()
          }
        />
        <Route
          path="/register"
          element={
            (() => {
              console.log('🛣️ [AppRoutes] /register route evaluation:', { isAuthenticated });
              if (isAuthenticated) {
                console.log('🛣️ [AppRoutes] User authenticated, redirecting from /register to /');
                return <Navigate to="/" />;
              } else {
                console.log('🛣️ [AppRoutes] User not authenticated, showing RegisterPage');
                return <RegisterPage />;
              }
            })()
          }
        />
        <Route path="/auth/google-success" element={<GoogleSuccessPage />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PrivateRoute>
              <PaymentSuccessPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
