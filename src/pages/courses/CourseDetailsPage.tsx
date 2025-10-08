import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Chip,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayCircleOutline,
  CheckCircle,
  Schedule,
  Star,
  Person,
  Language,
  ShoppingCart,
  PlayArrow,
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { cartService } from '../../services/cartService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../hooks/useAuth';
import { CourseDetails, Course, OrderItem, CartItem } from '../../types';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [similarCourses, setSimilarCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const checkIfInCart = useCallback(async () => {
    try {
      const courseId = Number(id);
      if (!id || isNaN(courseId)) return;
      
      const cart = await cartService.getCart();
      const courseInCart = cart.Items && cart.Items.length > 0 ? 
        cart.Items.some((item: CartItem) => item.CourseId === courseId) : false;
      setIsInCart(courseInCart);
    } catch (error) {
      console.error('Error checking cart:', error);
    }
  }, [id]);

  const checkIfPurchased = useCallback(async () => {
    try {
      const courseId = Number(id);
      if (!id || isNaN(courseId)) return;
      
      console.log('🔍 [CourseDetailsPage] Checking if course is purchased:', courseId);
      const orders = await orderService.getUserOrders();
      console.log('🔍 [CourseDetailsPage] User orders:', orders);
      
      const coursePurchased = orders.some(order => 
        order.Items?.some((item: OrderItem) => item.CourseId === courseId)
      );
      
      console.log('🔍 [CourseDetailsPage] Course purchased:', coursePurchased);
      setIsPurchased(coursePurchased);
    } catch (error) {
      console.error('❌ [CourseDetailsPage] Error checking if purchased:', error);
    }
  }, [id]);

  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // Validate ID
      const courseId = Number(id);
      if (!id || isNaN(courseId)) {
        console.error('Invalid course ID:', id);
        navigate('/courses');
        return;
      }
      
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);

      // Fetch similar courses
      const similarData = await courseService.getSimilarCourses(courseId, 4);
      setSimilarCourses(similarData);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id, fetchCourseDetails]);

  useEffect(() => {
    if (isAuthenticated && id) {
      checkIfInCart();
      checkIfPurchased();
    }
  }, [isAuthenticated, id, checkIfInCart, checkIfPurchased]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!course) return;

    try {
      console.log('🛒 [CourseDetailsPage] handleAddToCart called for course:', course.Id);
      setAddingToCart(true);
      const success = await cartService.addToCart(course.Id);
      console.log('🛒 [CourseDetailsPage] Add to cart success:', success);
      
      if (success) {
        setMessage({ type: 'success', text: 'Course added to cart successfully!' });
        setIsInCart(true);
        // Show success animation
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 2000);
        // Update cart counter in header
        console.log('🛒 [CourseDetailsPage] Dispatching cartUpdated event');
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        setMessage({ type: 'error', text: 'Course is already in your cart' });
      }
    } catch (error) {
      console.error('❌ [CourseDetailsPage] Error adding to cart:', error);
      setMessage({ type: 'error', text: 'Failed to add course to cart' });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  const learningOutcomes = course.LearningOutcomes?.split('\n').filter((item: string) => item.trim()) || [];
  const requirements = course.Requirements?.split('\n').filter((item: string) => item.trim()) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Course Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {course.Title}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {course.Description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={course.Rating || 0} readOnly />
              <Typography variant="body2">
                ({course.Rating || 0} rating)
              </Typography>
              {course.Level && <Chip label={course.Level} color="primary" />}
              {course.CategoryName && <Chip label={course.CategoryName} variant="outlined" />}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <Person />
              </Avatar>
              <Typography variant="body2">
                Created by <Box component="span" sx={{ fontWeight: 'bold' }}>{course.InstructorName}</Box>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule />
                <Typography variant="body2">
                  {course.Duration || 0} hours
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Language />
                <Typography variant="body2">
                  English
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Course Video/Image */}
          <Card sx={{ mb: 4, position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={course.ImagePath?.startsWith('http') ? course.ImagePath : `http://localhost:5145${course.ImagePath}` || '/placeholder-course.jpg'}
              alt={course.Title}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <PlayCircleOutline sx={{ fontSize: 80 }} />
            </Box>
          </Card>

          {/* What You'll Learn */}
          {learningOutcomes.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                What you'll learn
              </Typography>
              <List>
                {learningOutcomes.map((outcome: string, index: number) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={outcome} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Requirements */}
          {requirements.length > 0 && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Requirements
              </Typography>
              <List>
                {requirements.map((requirement: string, index: number) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText primary={requirement} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Reviews Section (Static) */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Student Reviews
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews will be displayed here
            </Typography>
          </Paper>

          {/* Share Section (Static) */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Share this course
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Social media sharing options will be available here
            </Typography>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
              ${course.Price}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {isPurchased ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/my-courses"
                  startIcon={<PlayArrow />}
                  sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                >
                  Go to My Courses
                </Button>
              ) : (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={addingToCart || isInCart}
                    startIcon={<ShoppingCart />}
                    sx={{
                      transform: showSuccessAnimation ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.3s ease-in-out',
                      backgroundColor: showSuccessAnimation ? 'success.main' : 'primary.main',
                      '&:hover': {
                        backgroundColor: showSuccessAnimation ? 'success.dark' : 'primary.dark',
                      }
                    }}
                  >
                    {isInCart ? 'Added to Cart' : addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              30-Day Money-Back Guarantee
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              This course includes:
            </Typography>

            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <Schedule />
                </ListItemIcon>
                <ListItemText primary={`${course.Duration} hours on-demand video`} />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Full lifetime access" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Certificate of completion" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Similar Courses */}
      {similarCourses.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            More Like This Courses
          </Typography>
          <Grid container spacing={3}>
            {similarCourses.map((similarCourse) => (
              <Grid item xs={12} sm={6} md={3} key={similarCourse.Id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => navigate(`/courses/${similarCourse.Id}`)}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={similarCourse.ImagePath?.startsWith('http') ? similarCourse.ImagePath : `http://localhost:5145${similarCourse.ImagePath}` || '/placeholder-course.jpg'}
                    alt={similarCourse.Title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {similarCourse.Title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By {similarCourse.InstructorName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Rating value={similarCourse.Rating} readOnly size="small" />
                      <Typography variant="h6" color="primary" sx={{ ml: 'auto' }}>
                        ${similarCourse.Price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default CourseDetailsPage;