import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Rating,
  Button,
  Pagination,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Search, FilterList, School } from '@mui/icons-material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { categoryService } from '../../services/categoryService';
import { cartService } from '../../services/cartService';
import { useAuth } from '../../hooks/useAuth';
import { Course, Category, CourseFilters } from '../../types';

const CoursesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CourseFilters>({
    search: searchParams.get('search') || '',
    categoryId: Number(searchParams.get('categoryId')) || undefined,
    minPrice: 0,
    maxPrice: 50000, // Increased to show all courses including expensive ones
    minRating: 0,
    sortBy: 'title',
    page: 1,
    pageSize: 6
  });

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses({
        ...filters,
        page
      });
      setCourses(response.Items);
      setTotalCount(response.TotalCount);
    } catch (error) {
      console.error('❌ [CoursesPage] Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleFilterChange = (newFilters: Partial<CourseFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPage(1);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    if (updatedFilters.categoryId) params.set('categoryId', updatedFilters.categoryId.toString());
    setSearchParams(params);
  };

  const handleAddToCart = async (courseId: number) => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }

    try {
      await cartService.addToCart(courseId);
      // Show success message
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / (filters.pageSize || 6));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Explore Courses
      </Typography>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <FilterList sx={{ mr: 1 }} />
              Filters
            </Typography>

            {/* Search */}
            <TextField
              fullWidth
              label="Search Courses"
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange({ search: e.target.value })}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />

            {/* Category Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.categoryId || ''}
                label="Category"
                onChange={(e: any) => handleFilterChange({
                  categoryId: e.target.value ? Number(e.target.value) : undefined
                })}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories && categories.length > 0 ? categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id}>
                    {category.Name}
                  </MenuItem>
                )) : null}
              </Select>
            </FormControl>

            {/* Price Range */}
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 50000]}
              onChange={(_: any, newValue: any) => {
                const [min, max] = newValue as number[];
                handleFilterChange({ minPrice: min, maxPrice: max });
              }}
              valueLabelDisplay="auto"
              max={50000}
              sx={{ mb: 3 }}
            />

            {/* Rating Filter */}
            <Typography gutterBottom>Minimum Rating</Typography>
            <Slider
              value={filters.minRating || 0}
              onChange={(_: any, newValue: any) => handleFilterChange({ minRating: newValue as number })}
              step={0.5}
              marks
              min={0}
              max={5}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />

            {/* Sort By */}
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'title'}
                label="Sort By"
                onChange={(e: any) => handleFilterChange({ sortBy: e.target.value })}
              >
                <MenuItem value="title">Title A-Z</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="date">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Courses Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {totalCount} courses found
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {courses && courses.length > 0 ? courses.map((course) => (
                  <Grid item xs={12} sm={6} lg={4} key={course.Id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={course.ImagePath?.startsWith('http') ? course.ImagePath : `http://mohamedexfs60-001-site1.mtempurl.com${course.ImagePath}` || '/placeholder-course.jpg'}
                        alt={course.Title}
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
                          <Chip label={course.CategoryName} size="small" variant="outlined" />
                        </Box>

                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${course.Price}
                          </Typography>

                          {isAuthenticated && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddToCart(course.Id)}
                              startIcon={<School />}
                            >
                              Add to Cart
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        No courses found
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_: any, newPage: any) => setPage(newPage)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CoursesPage;