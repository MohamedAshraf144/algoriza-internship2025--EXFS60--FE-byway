import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  CreditCard,
  Lock,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { cartService } from '../../services/cartService';
import { Cart, CreateOrder, CartItem } from '../../types';

interface CheckoutFormData {
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  notes?: string;
}

const schema = yup.object({
  paymentMethod: yup.string().required('Payment method is required'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^[0-9\s]+$/, 'Card number must contain only numbers and spaces')
    .min(13, 'Card number must be at least 13 digits')
    .max(19, 'Card number must not exceed 19 digits')
    .test('card-number-format', 'Invalid card number format', function(value) {
      if (!value) return false;
      // Remove spaces and check if it's all digits
      const cleanNumber = value.replace(/\s/g, '');
      return /^\d{13,19}$/.test(cleanNumber);
    }),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .test('expiry-date-valid', 'Expiry date must be in the future', function(value) {
      if (!value) return false;
      const [month, year] = value.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const expYear = parseInt(year);
      const expMonth = parseInt(month);
      
      if (expYear < currentYear) return false;
      if (expYear === currentYear && expMonth < currentMonth) return false;
      return true;
    }),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .test('cvv-length', 'CVV must be 3 or 4 digits', function(value) {
      if (!value) return false;
      return value.length === 3 || value.length === 4;
    }),
  cardholderName: yup
    .string()
    .required('Cardholder name is required')
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(50, 'Cardholder name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Cardholder name must contain only letters and spaces'),
  notes: yup
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Input formatting functions
  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue;
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentMethod: 'credit_card',
    },
  });

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);

      // If cart is empty, redirect to cart page
      if (!cartData.Items.length) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setMessage({ type: 'error', text: 'Failed to load cart' });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setProcessing(true);
      setMessage(null);

      const orderData: Omit<CreateOrder, 'userId'> = {
        paymentMethod: data.paymentMethod,
        notes: data.notes || '',
      };

      const order = await cartService.createOrder(orderData);

      // Navigate to success page
      navigate('/payment-success', {
        state: {
          orderId: order.Id,
          totalAmount: order.FinalAmount
        }
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Payment failed. Please try again.'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!cart || cart.Items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Checkout
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Payment Form */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(66.67% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Information
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  {...register('paymentMethod')}
                  label="Payment Method"
                  defaultValue="credit_card"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>

              <TextField
                {...register('cardholderName')}
                fullWidth
                label="Cardholder Name"
                error={!!errors.cardholderName}
                helperText={errors.cardholderName?.message}
                inputProps={{
                  maxLength: 50,
                  pattern: '[a-zA-Z ]*'
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                {...register('cardNumber')}
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                error={!!errors.cardNumber}
                helperText={errors.cardNumber?.message}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  e.target.value = formatted;
                }}
                inputProps={{
                  maxLength: 19,
                  inputMode: 'numeric',
                  pattern: '[0-9 ]*'
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ flex: '1 1 50%' }}>
                  <TextField
                    {...register('expiryDate')}
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate?.message}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      e.target.value = formatted;
                    }}
                    inputProps={{
                      maxLength: 5,
                      inputMode: 'numeric',
                      pattern: '[0-9/]*'
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 50%' }}>
                  <TextField
                    {...register('cvv')}
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    error={!!errors.cvv}
                    helperText={errors.cvv?.message}
                    onChange={(e) => {
                      const formatted = formatCVV(e.target.value);
                      e.target.value = formatted;
                    }}
                    inputProps={{
                      maxLength: 4,
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                  />
                </Box>
              </Box>

              <TextField
                {...register('notes')}
                fullWidth
                label="Order Notes (Optional)"
                multiline
                rows={3}
                placeholder="Any special instructions or notes..."
                error={!!errors.notes}
                helperText={errors.notes?.message}
                inputProps={{
                  maxLength: 500
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lock sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Your payment information is secure and encrypted
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {processing ? 'Processing Payment...' : `Complete Payment - $${cart.FinalTotal.toFixed(2)}`}
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.33% - 16px)' } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            <List>
              {cart.Items.map((item: CartItem) => (
                <ListItem key={item.Id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.CourseImage || '/placeholder-course.jpg'}
                      alt={item.CourseTitle}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.CourseTitle}
                    secondary={`By ${item.InstructorName}`}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    ${item.CoursePrice}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">
                  ${cart.TotalPrice.toFixed(2)}
                </Typography>
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Tax (15%)" />
                <Typography variant="body1">
                  ${cart.TaxAmount.toFixed(2)}
                </Typography>
              </ListItem>

              <Divider sx={{ my: 1 }} />

              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                  }
                />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${cart.FinalTotal.toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutPage;