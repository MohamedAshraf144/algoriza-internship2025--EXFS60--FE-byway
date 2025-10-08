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
  CircularProgress,
  Alert,
  Chip,
  Rating,
} from '@mui/material';
import { School, PlayArrow, Schedule } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

interface MyCourse {
  Id: number;
  Title: string;
  Description: string;
  ImagePath: string;
  InstructorName: string;
  Duration: number;
  Level: string;
  Rating: number;
  Price: number;
  PurchaseDate: string;
}

const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📚 [MyCoursesPage] Fetching user orders for user:', user?.Id);
      
      // Fetch user orders using the service
      const orders: Order[] = await orderService.getUserOrders();
      console.log('📚 [MyCoursesPage] Orders received:', orders);
      
      // Extract courses from all orders
      const allCourses: MyCourse[] = [];
      
      orders.forEach(order => {
        order.Items?.forEach(item => {
          allCourses.push({
            Id: item.CourseId,
            Title: item.CourseTitle || 'Unknown Course',
            Description: '', // Will be fetched from course details if needed
            ImagePath: item.CourseImage || '/placeholder-course.jpg',
            InstructorName: item.InstructorName || 'Unknown Instructor',
            Duration: item.Duration || 0,
            Level: item.Level || 'Beginner',
            Rating: item.Rating || 0,
            Price: item.Price,
            PurchaseDate: order.OrderDate,
          });
        });
      });

      console.log('📚 [MyCoursesPage] Extracted courses:', allCourses);
      setCourses(allCourses);
    } catch (error) {
      console.error('❌ [MyCoursesPage] Error fetching my courses:', error);
      setError('Failed to load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.Id]);

  useEffect(() => {
    if (user?.Id) {
      fetchMyCourses();
    }
  }, [user?.Id, fetchMyCourses]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {courses.length > 0 
            ? `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} in your library`
            : 'You haven\'t purchased any courses yet'
          }
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Box textAlign="center" py={8}>
          <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No courses yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start your learning journey by exploring our courses
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/courses"
            startIcon={<School />}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.Id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.ImagePath?.startsWith('http') ? course.ImagePath : `http://mohamedexfs60-001-site1.mtempurl.com${course.ImagePath}` || '/placeholder-course.jpg'}
                  alt={course.Title}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    component={RouterLink}
                    to={`/courses/${course.Id}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { color: 'primary.main' },
                      mb: 1
                    }}
                  >
                    {course.Title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    By {course.InstructorName}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={course.Rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({course.Rating})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={course.Level} size="small" />
                    <Chip 
                      icon={<Schedule />} 
                      label={`${course.Duration}h`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Purchased on {new Date(course.PurchaseDate).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      component={RouterLink}
                      to={`/courses/${course.Id}`}
                      startIcon={<PlayArrow />}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCoursesPage;
