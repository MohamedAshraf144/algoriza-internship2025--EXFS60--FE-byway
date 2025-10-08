import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import {
  PlayArrow,
  Star,
  People,
  TrendingUp,
  School,
  Category as CategoryIcon,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import { Course, Category } from '../../types';

const HomePage: React.FC = () => {
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🏠 [HomePage] Fetching data...');
        const [coursesData, categoriesData] = await Promise.all([
          courseService.getTopCourses(6),
          categoryService.getCategories()
        ]);
        console.log('🏠 [HomePage] Courses data:', coursesData);
        console.log('🏠 [HomePage] Categories data:', categoriesData);
        setTopCourses(coursesData);
        setCategories(categoriesData.slice(0, 8)); // Show first 8 categories
      } catch (error) {
        console.error('❌ [HomePage] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      mb: 3
                    }}
                  >
          Learn Without Limits
        </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      opacity: 0.9,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                  >
                    Discover thousands of courses from expert instructors and transform your skills
        </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/courses"
                      endIcon={<ArrowForward />}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': { 
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        },
                        transition: 'all 0.3s ease'
          }}
        >
          Explore Courses
        </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        '&:hover': { 
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      <PlayArrow sx={{ mr: 1 }} />
                      Watch Demo
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ textAlign: 'center' }}>
                  <Paper
                    elevation={10}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                          <People />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            10,000+
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Active Students
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                          <School />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            500+
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Expert Instructors
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                          <TrendingUp />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            95%
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Success Rate
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>

      {/* Categories Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
          Popular Categories
        </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Explore our diverse range of courses across different fields and technologies
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={category.Id}>
                <Fade in timeout={800 + index * 100}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s ease',
                }}
                component={RouterLink}
                to={`/courses?categoryId=${category.Id}`}
              >
                    <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                        height="160"
                  image={category.ImagePath || 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=Category'}
                  alt={category.Name}
                        sx={{
                          filter: 'brightness(0.8)',
                          '&:hover': { filter: 'brightness(1)' },
                          transition: 'filter 0.3s ease'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          '&:hover': { opacity: 1 },
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                          <ArrowForward />
                        </IconButton>
                      </Box>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                    {category.Name}
                  </Typography>
                      </Box>
                  <Typography variant="body2" color="text.secondary">
                        {category.CoursesCount} courses available
                  </Typography>
                </CardContent>
              </Card>
                </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Top Courses Section */}
      <Box>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
          Top Rated Courses
        </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover our most popular and highly-rated courses from industry experts
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {topCourses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={course.Id}>
                <Fade in timeout={1000 + index * 150}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s ease',
                }}
                component={RouterLink}
                to={`/courses/${course.Id}`}
              >
                    <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                        height="220"
                  image={course.ImagePath?.startsWith('http') ? course.ImagePath : `http://mohamedexfs60-001-site1.mtempurl.com${course.ImagePath}` || '/placeholder-course.jpg'}
                  alt={course.Title}
                        sx={{
                          filter: 'brightness(0.9)',
                          '&:hover': { filter: 'brightness(1)' },
                          transition: 'filter 0.3s ease'
                        }}
                      />
                      <Chip
                        label={course.Level}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(0,0,0,0.7)',
                          borderRadius: 2,
                          px: 1,
                          py: 0.5
                        }}
                      >
                        <Star sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" color="white" fontWeight="bold">
                          {course.Rating}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                    {course.Title}
                  </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2 }}
                      >
                    By {course.InstructorName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={course.Rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({course.Rating}) • {Math.floor(Math.random() * 1000) + 100} students
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.Duration}h
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                      ${course.Price}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
                </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
    </Box>
  );
};

export default HomePage;