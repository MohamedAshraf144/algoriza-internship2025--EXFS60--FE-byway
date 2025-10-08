import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircleOutline,
  Email,
  School,
  Home,
  Download,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state as { orderId: number; totalAmount: number } | null;

  useEffect(() => {
    // Update cart counter in header after successful payment
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }, []);

  const handleReturnHome = () => {
    navigate('/');
  };

  if (!orderData) {
    // If accessed directly without order data, redirect to home
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <CheckCircleOutline
          sx={{
            fontSize: 120,
            color: 'success.main',
            mb: 3,
          }}
        />

        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="success.main">
          Payment Successful!
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase! Your courses are now available.
        </Typography>

        <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body1">
            Order ID: <strong>#{orderData.orderId}</strong>
          </Typography>
          <Typography variant="body1">
            Total Amount: <strong>${orderData.totalAmount.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ textAlign: 'left' }}>
          What happens next?
        </Typography>

        <List sx={{ mb: 4 }}>
          <ListItem>
            <ListItemIcon>
              <Email color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Confirmation Email"
              secondary="You'll receive a confirmation email with your order details and course access information."
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <School color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Course Access"
              secondary="Your courses are now available in your dashboard. Start learning immediately!"
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Download color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Download Materials"
              secondary="Access downloadable resources, assignments, and course materials anytime."
            />
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleReturnHome}
            startIcon={<Home />}
          >
            Return to Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/courses')}
            startIcon={<School />}
          >
            Browse More Courses
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Need help? Contact our support team at support@byway.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;