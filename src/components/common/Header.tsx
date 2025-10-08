import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Stack,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  School,
  Menu as MenuIcon,
  Close,
  Dashboard,
  Logout,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cartService } from '../../services/cartService';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartAnimation, setCartAnimation] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const fetchCartCount = useCallback(async () => {
    console.log('🛒 [Header] fetchCartCount called, isAuthenticated:', isAuthenticated);
    console.log('🛒 [Header] user:', user);
    
    if (isAuthenticated && user && user.Id) {
      try {
        console.log('🛒 [Header] Fetching cart for user ID:', user.Id);
        const cart = await cartService.getCart();
        console.log('🛒 [Header] Cart fetched successfully:', cart);
        const newCount = cart.ItemsCount || 0;
        console.log('🛒 [Header] Setting cart count to:', newCount);
        setCartItemsCount(newCount);
      } catch (error) {
        console.error('❌ [Header] Error fetching cart count:', error);
        setCartItemsCount(0);
      }
    } else {
      console.log('🛒 [Header] User not authenticated or no user ID, setting cart count to 0');
      setCartItemsCount(0);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated, fetchCartCount]);

  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('🛒 [Header] cartUpdated event received!');
      console.log('🛒 [Header] Current cart animation state:', cartAnimation);
      fetchCartCount();
      // Trigger cart animation
      console.log('🛒 [Header] Setting cart animation to true');
      setCartAnimation(true);
      setTimeout(() => {
        console.log('🛒 [Header] Setting cart animation to false');
        setCartAnimation(false);
      }, 1000);
    };

    console.log('🛒 [Header] Adding cartUpdated event listener');
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      console.log('🛒 [Header] Removing cartUpdated event listener');
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartCount, cartAnimation]);

  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <School sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 'bold',
                fontSize: '1.8rem'
              }}
            >
              Byway
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Button
              component={RouterLink}
              to="/courses"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' }
              }}
            >
              Courses
            </Button>

            {isAuthenticated && (
              <Button
                component={RouterLink}
                to="/my-courses"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                My Courses
              </Button>
            )}

            {isAuthenticated ? (
              <>
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  sx={{ 
                    color: 'text.primary',
                    transform: cartAnimation ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: cartAnimation ? 'scale(1.3)' : 'scale(1.1)',
                    }
                  }}
                >
                  <Badge 
                    badgeContent={cartItemsCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        animation: cartAnimation ? 'pulse 0.6s ease-in-out' : 'none',
                      }
                    }}
                  >
                    <ShoppingCart 
                      sx={{
                        animation: cartAnimation ? 'bounce 0.6s ease-in-out' : 'none',
                      }}
                    />
                  </Badge>
                </IconButton>

                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    startIcon={<Dashboard />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    Admin
                  </Button>
                )}

                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                    {user?.FirstName?.[0] || <AccountCircle />}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem disabled sx={{ opacity: 1, bgcolor: 'grey.50' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user?.FirstName} {user?.LastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.Email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 3,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: 'block', md: 'none' }, ml: 2 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Close /> : <MenuIcon />}
          </IconButton>
        </Toolbar>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Box sx={{ 
            display: { xs: 'block', md: 'none' },
            bgcolor: 'grey.50',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            py: 2
          }}>
            <Stack spacing={2} sx={{ px: 2 }}>
              <Button
                component={RouterLink}
                to="/courses"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Courses
              </Button>

              {isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/my-courses"
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  My Courses
                </Button>
              )}
              
              {isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/cart"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                    startIcon={<ShoppingCart />}
                  >
                    Cart {cartItemsCount > 0 && <Chip label={cartItemsCount} size="small" sx={{ ml: 1 }} />}
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      component={RouterLink}
                      to="/admin"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                      startIcon={<Dashboard />}
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleLogout}
                    fullWidth
                    sx={{ justifyContent: 'flex-start', color: 'error.main' }}
                    startIcon={<Logout />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Container>
    </AppBar>
    </>
  );
};

export default Header;