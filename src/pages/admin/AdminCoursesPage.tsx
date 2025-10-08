import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Pagination,
  Tooltip,
  Slider,
} from '@mui/material';
import {
  Add,
  School,
  Edit,
  Delete,
  Lock,
  Search,
  FilterList,
} from '@mui/icons-material';
import { categoryService } from '../../services/categoryService';
import { instructorService } from '../../services/instructorService';
import { courseService } from '../../services/courseService';
import { Course } from '../../types';
import ImageUpload from '../../components/common/ImageUpload';

const AdminCoursesPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [purchasedCourses, setPurchasedCourses] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [minRating, setMinRating] = useState('');
  const pageSize = 6;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: '',
    imagePath: '',
    categoryId: '',
    instructorId: '',
    requirements: '',
    learningOutcomes: '',
    rating: ''
  });

  const fetchCourses = useCallback(async (page: number = currentPage) => {
    try {
      console.log('🔍 [AdminCoursesPage] Fetching courses for page:', page);
      const response = await courseService.getCourses({ 
        page, 
        pageSize,
        search: searchTerm || undefined,
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined
      });
      console.log('🔍 [AdminCoursesPage] Response received:', response);
      
      // Add safety checks
      if (!response) {
        console.error('❌ [AdminCoursesPage] Response is null/undefined');
        setCourses([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }
      
      if (!response.Items) {
        console.error('❌ [AdminCoursesPage] Response.Items is null/undefined');
        setCourses([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }
      
      console.log('✅ [AdminCoursesPage] Setting courses:', response.Items);
      setCourses(response.Items);
      setTotalCount(response.TotalCount || 0);
      setTotalPages(Math.ceil((response.TotalCount || 0) / pageSize));
      
      // Check which courses have been purchased
      await checkPurchasedCourses(response.Items);
    } catch (error) {
      console.error('❌ [AdminCoursesPage] Error fetching courses:', error);
      setCourses([]);
      setTotalCount(0);
      setTotalPages(1);
    }
  }, [currentPage, pageSize, searchTerm, selectedCategory, priceRange, minRating]);

  const checkPurchasedCourses = async (courses: Course[]) => {
    try {
      // For now, we'll use a simple approach - check if any course has been purchased
      // In a real app, you might want to add an API endpoint to check this
      const purchasedSet = new Set<number>();
      
      // You could add an API call here to check which courses have been purchased
      // For now, we'll leave it empty and let the error handling show when trying to edit
      
      setPurchasedCourses(purchasedSet);
    } catch (error) {
      console.error('Error checking purchased courses:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndInstructors();
    fetchCourses();
  }, [fetchCourses]);

  const fetchCategoriesAndInstructors = async () => {
    try {
      console.log('🔍 [AdminCoursesPage] Fetching categories and instructors...');
      const [categoriesData, instructorsData] = await Promise.all([
        categoryService.getCategories(),
        instructorService.getInstructors()
      ]);
      console.log('🔍 [AdminCoursesPage] Categories data:', categoriesData);
      console.log('🔍 [AdminCoursesPage] Instructors data:', instructorsData);
      
      setCategories(categoriesData || []);
      setInstructors(instructorsData?.Items || []); // Extract items from PaginatedResult with safety check
    } catch (error) {
      console.error('❌ [AdminCoursesPage] Error fetching data:', error);
      setCategories([]);
      setInstructors([]);
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      level: '',
      imagePath: '',
      categoryId: '',
      instructorId: '',
      requirements: '',
      learningOutcomes: '',
      rating: ''
    });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      level: '',
      imagePath: '',
      categoryId: '',
      instructorId: '',
      requirements: '',
      learningOutcomes: '',
      rating: ''
    });
    setError('');
    setSuccess('');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.Title || '',
      description: course.Description || '',
      price: (course.Price || 0).toString(),
      duration: (course.Duration || 0).toString(),
      level: course.Level || 'Beginner',
      imagePath: course.ImagePath || '',
      categoryId: course.CategoryId ? course.CategoryId.toString() : '',
      instructorId: course.InstructorId ? course.InstructorId.toString() : '',
      requirements: course.Requirements || '',
      learningOutcomes: course.LearningOutcomes || '',
      rating: (course.Rating || 0).toString()
    });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      setLoading(true);
      await courseService.deleteCourse(courseToDelete.Id);
      setSuccess('✅ Course deleted successfully!');
      setOpenDeleteDialog(false);
      setCourseToDelete(null);
      fetchCourses();
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('❌ Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteCourse = () => {
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Duration must be greater than 0');
      return false;
    }
    if (!formData.categoryId) {
      setError('Category is required');
      return false;
    }
    if (!formData.instructorId) {
      setError('Instructor is required');
      return false;
    }
    if (!formData.level) {
      setError('Level is required');
      return false;
    }
    if (formData.rating && (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
      setError('Rating must be between 0 and 5');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('Title', formData.title);
      formDataToSend.append('Description', formData.description);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Duration', formData.duration);
      
      // Convert level string to enum number
      const levelMapping: { [key: string]: number } = {
        'Beginner': 2,
        'Intermediate': 3,
        'Expert': 4,
        'AllLevels': 1
      };
      const levelValue = levelMapping[formData.level] || 2; // Default to Beginner
      formDataToSend.append('Level', levelValue.toString());
      
      formDataToSend.append('Requirements', formData.requirements);
      formDataToSend.append('LearningOutcomes', formData.learningOutcomes);
      formDataToSend.append('CategoryId', formData.categoryId);
      formDataToSend.append('InstructorId', formData.instructorId);
      // Ensure rating is always a valid decimal
      let ratingValue = '0';
      if (formData.rating && formData.rating.trim() !== '') {
        const parsedRating = parseFloat(formData.rating);
        if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
          ratingValue = parsedRating.toString();
        }
      }
      formDataToSend.append('Rating', ratingValue);
      
      // If image is base64, convert to blob and append
      if (formData.imagePath && formData.imagePath.startsWith('data:image/')) {
        const response = await fetch(formData.imagePath);
        const blob = await response.blob();
        formDataToSend.append('Image', blob, 'course-image.jpg');
      }
      
      // Make API call with FormData
      const url = editingCourse 
        ? `https://mohamedexfs60-001-site1.mtempurl.com/api/courses/${editingCourse.Id}`
        : 'https://mohamedexfs60-001-site1.mtempurl.com/api/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      // Debug: Log form data
      console.log('📝 [AdminCoursesPage] Form data being sent:');
      formDataToSend.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [AdminCoursesPage] API Error:', errorData);
        console.error('❌ [AdminCoursesPage] Response status:', response.status);
        
        // Handle specific error for purchased courses
        if (errorData.message && errorData.message.includes('Cannot update course that has been purchased')) {
          throw new Error('This course cannot be updated because it has been purchased by students. You can only update courses that haven\'t been purchased yet.');
        }
        
        throw new Error(errorData.message || `Failed to ${editingCourse ? 'update' : 'add'} course`);
      }
      
      setSuccess(`✅ Course ${editingCourse ? 'updated' : 'added'} successfully!`);
      setTimeout(() => {
        handleCloseDialog();
        fetchCourses();
        setSuccess('');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchCourses(page);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <School sx={{ mr: 1, verticalAlign: 'middle' }} />
          Course Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleAddCourse}
        >
          Add Course
        </Button>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Course Management Page
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          This page will include:
        </Typography>
        <Box component="ul" sx={{ textAlign: 'left', mt: 2, pl: 2 }}>
          <Box component="li">Add new courses with validation</Box>
          <Box component="li">Edit existing courses (if not purchased)</Box>
          <Box component="li">Delete courses (if not purchased)</Box>
          <Box component="li">Search by name, price, rating, and category</Box>
          <Box component="li">Pagination for course list</Box>
        </Box>
      </Paper>

      {/* Add Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Course Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange('title')}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.price}
              onChange={handleInputChange('price')}
            />
          </Box>
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange('description')}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId || ''}
                onChange={handleInputChange('categoryId')}
                label="Category"
              >
                {categories && categories.length > 0 ? categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id}>
                    {category.Name}
                  </MenuItem>
                )) : (
                  <MenuItem disabled>No categories available</MenuItem>
                )}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="dense">
              <InputLabel>Instructor</InputLabel>
              <Select
                value={formData.instructorId || ''}
                onChange={handleInputChange('instructorId')}
                label="Instructor"
              >
                {instructors && instructors.length > 0 ? instructors.map((instructor) => (
                  <MenuItem key={instructor.Id} value={instructor.Id}>
                    {instructor.Name}
                  </MenuItem>
                )) : (
                  <MenuItem disabled>No instructors available</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              label="Duration (hours)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.duration}
              onChange={handleInputChange('duration')}
            />
            <TextField
              margin="dense"
              label="Rating (0-5)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.rating}
              onChange={handleInputChange('rating')}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Level</InputLabel>
              <Select
                value={formData.level || 'Beginner'}
                onChange={handleInputChange('level')}
                label="Level"
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <ImageUpload
            value={formData.imagePath}
            onChange={(imageUrl: string) => setFormData(prev => ({ ...prev, imagePath: imageUrl }))}
            label="Course Image"
            error={error}
            disabled={loading}
          />
          
          <TextField
            margin="dense"
            label="Requirements"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={formData.requirements}
            onChange={handleInputChange('requirements')}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Learning Outcomes"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={formData.learningOutcomes}
            onChange={handleInputChange('learningOutcomes')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.title || !formData.categoryId || !formData.instructorId}
          >
            {loading ? (editingCourse ? 'Updating...' : 'Adding...') : (editingCourse ? 'Update Course' : 'Add Course')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search and Filter Section */}
      <Box sx={{ mt: 4, mb: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Search & Filter Courses
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              label="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.Id} value={category.Id}>
                    {category.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 5000, label: '$5000' },
                  { value: 10000, label: '$10000' }
                ]}
              />
            </Box>
            
            <TextField
              label="Min Rating"
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              sx={{ minWidth: 120 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange([0, 10000]);
                setMinRating('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Courses List */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Courses ({totalCount} total)
        </Typography>
        
        {!courses || courses.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "Add Course" to create your first course
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {courses && courses.map((course) => (
              <Box key={course.Id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.ImagePath?.startsWith('http') ? course.ImagePath : `https://mohamedexfs60-001-site1.mtempurl.com${course.ImagePath}` || '/placeholder-course.jpg'}
                    alt={course.Title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {course.Title}
                      </Typography>
                      {purchasedCourses.has(course.Id) && (
                        <Chip
                          icon={<Lock />}
                          label="Purchased"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={course.Level} 
                        color="primary" 
                        size="small" 
                      />
                      <Chip 
                        label={course.CategoryName} 
                        color="secondary" 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                      {course.Description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">
                        ${course.Price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {course.Duration}h
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ⭐ {course.Rating || 0}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Tooltip 
                        title={purchasedCourses.has(course.Id) ? "Cannot edit purchased course" : "Edit course"}
                        arrow
                      >
                        <span>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditCourse(course)}
                            size="small"
                            disabled={purchasedCourses.has(course.Id)}
                          >
                            <Edit />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip 
                        title={purchasedCourses.has(course.Id) ? "Cannot delete purchased course" : "Delete course"}
                        arrow
                      >
                        <span>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteCourse(course)}
                            size="small"
                            disabled={purchasedCourses.has(course.Id)}
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDeleteCourse}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#fee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3
            }}
          >
            <Delete sx={{ fontSize: 40, color: '#f44336' }} />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Are you sure you want to delete this
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Course {courseToDelete?.Title} ?
          </Typography>
        </Box>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={cancelDeleteCourse}
            variant="outlined"
            sx={{
              minWidth: 120,
              textTransform: 'none',
              borderRadius: 2,
              color: '#666',
              borderColor: '#ddd',
              '&:hover': {
                borderColor: '#999',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteCourse}
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 120,
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#f44336',
              '&:hover': {
                bgcolor: '#d32f2f'
              }
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCoursesPage;