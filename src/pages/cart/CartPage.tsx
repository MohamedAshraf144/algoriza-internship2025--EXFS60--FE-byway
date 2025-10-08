import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Delete,
  ShoppingCartCheckout,
  School,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { Cart, CartItem } from '../../types';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setMessage({ type: 'error', text: 'Failed to load cart' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId: number) => {
    try {
      setRemoving(courseId);
      const success = await cartService.removeFromCart(courseId);
      if (success) {
        await fetchCart();
        setMessage({ type: 'success', text: 'Course removed from cart' });
        // Update cart counter in header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove course from cart' });
    } finally {
      setRemoving(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const success = await cartService.clearCart();
      if (success) {
        await fetchCart();
        setMessage({ type: 'success', text: 'Cart cleared successfully' });
        // Update cart counter in header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear cart' });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!cart || !cart.Items || cart.Items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any courses to your cart yet.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/courses')}
        >
          Browse Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Shopping Cart
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          onClose={() => setMessage(null)}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            {cart.ItemsCount || 0} course{(cart.ItemsCount || 0) !== 1 ? 's' : ''} in cart
          </Typography>

          {cart.Items && cart.Items.length > 0 ? cart.Items.map((item: CartItem) => (
            <Card key={item.Id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={item.CourseImage || '/placeholder-course.jpg'}
                      alt={item.CourseTitle}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom>
                      {item.CourseTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      By {item.InstructorName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule fontSize="small" />
                      <Typography variant="body2">
                        {item.Duration} hours
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${item.CoursePrice}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.CourseId)}
                      disabled={removing === item.CourseId}
                    >
                      {removing === item.CourseId ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Delete />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No items in cart
            </Typography>
          )}

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">
                  ${(cart.TotalPrice || 0).toFixed(2)}
                </Typography>
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Tax (15%)" />
                <Typography variant="body1">
                  ${(cart.TaxAmount || 0).toFixed(2)}
                </Typography>
              </ListItem>

              <Divider sx={{ my: 2 }} />

              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                  }
                />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${(cart.FinalTotal || 0).toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              startIcon={<ShoppingCartCheckout />}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              30-Day Money-Back Guarantee
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;