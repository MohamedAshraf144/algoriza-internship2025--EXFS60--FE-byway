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
  CircularProgress,
  Pagination,
  Rating,
} from '@mui/material';
import {
  Add,
  Person,
  Edit,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import ImageUpload from '../../components/common/ImageUpload';
import { instructorService } from '../../services/instructorService';
import { Instructor } from '../../types';

const AdminInstructorsPage: React.FC = () => {
  console.log('🚀 [AdminInstructorsPage] Component mounted!');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 6;
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imagePath: '',
    jobTitle: '',
    rating: ''
  });

  const fetchInstructors = useCallback(async (page: number = currentPage) => {
    try {
      setLoadingInstructors(true);
      console.log('🔍 [AdminInstructorsPage] Fetching instructors for page:', page);
      const response = await instructorService.getInstructors(page, pageSize, searchTerm);
      console.log('✅ [AdminInstructorsPage] Instructors response:', response);
      
      // Add safety checks
      if (!response) {
        console.error('❌ [AdminInstructorsPage] Response is null/undefined');
        setInstructors([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }
      
      if (!response.Items) {
        console.error('❌ [AdminInstructorsPage] Response.Items is null/undefined');
        setInstructors([]);
        setTotalCount(0);
        setTotalPages(1);
        return;
      }
      
      console.log('✅ [AdminInstructorsPage] Instructors count:', response.Items.length);
      setInstructors(response.Items);
      setTotalCount(response.TotalCount);
      setTotalPages(Math.ceil(response.TotalCount / pageSize));
    } catch (error) {
      console.error('❌ [AdminInstructorsPage] Error fetching instructors:', error);
    } finally {
      setLoadingInstructors(false);
    }
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    console.log('🔄 [AdminInstructorsPage] useEffect triggered, calling fetchInstructors...');
    fetchInstructors();
  }, [fetchInstructors]);

  const handleAddInstructor = () => {
    setEditingInstructor(null);
    setFormData({ name: '', bio: '', imagePath: '', jobTitle: '', rating: '' });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInstructor(null);
    setFormData({ name: '', bio: '', imagePath: '', jobTitle: '', rating: '' });
    setError('');
    setSuccess('');
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.Name || '',
      bio: instructor.Bio || '',
      imagePath: instructor.ImagePath || '',
      jobTitle: instructor.JobTitle || '',
      rating: (instructor.Rating || 0).toString()
    });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteInstructor = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteInstructor = async () => {
    if (!instructorToDelete) return;
    
    try {
      setLoading(true);
      await instructorService.deleteInstructor(instructorToDelete.Id);
      setSuccess('✅ Instructor deleted successfully!');
      setOpenDeleteDialog(false);
      setInstructorToDelete(null);
      fetchInstructors();
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('❌ Failed to delete instructor');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setInstructorToDelete(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.jobTitle.trim()) {
      setError('Job title is required');
      return false;
    }
    if (!formData.bio.trim()) {
      setError('Bio is required');
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
      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Bio', formData.bio);
      // Convert frontend job title to backend enum value
      const jobTitleMapping: { [key: string]: string } = {
        'Backend': 'BackendDeveloper',
        'BackendDeveloper': 'BackendDeveloper',
        'Fullstack': 'FullstackDeveloper',
        'FullstackDeveloper': 'FullstackDeveloper',
        'Frontend': 'FrontendDeveloper',
        'FrontendDeveloper': 'FrontendDeveloper',
        'UIUX': 'UXUIDesigner',
        'UXUIDesigner': 'UXUIDesigner'
      };
      
      formDataToSend.append('JobTitle', jobTitleMapping[formData.jobTitle] || formData.jobTitle);
      
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
        formDataToSend.append('Image', blob, 'instructor-image.jpg');
      }
      
      // Make API call with FormData
      const url = editingInstructor 
        ? `http://mohamedexfs60-001-site1.mtempurl.com/api/instructors/${editingInstructor.Id}`
        : 'http://mohamedexfs60-001-site1.mtempurl.com/api/instructors';
      
      const method = editingInstructor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingInstructor ? 'update' : 'add'} instructor`);
      }
      
      setSuccess(`✅ Instructor ${editingInstructor ? 'updated' : 'added'} successfully!`);
      setTimeout(() => {
        handleCloseDialog();
        fetchInstructors();
        setSuccess('');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to add instructor');
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
    fetchInstructors(page);
  };

  console.log('🎨 [AdminInstructorsPage] Rendering with instructors:', instructors.length, 'loading:', loadingInstructors);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
          Instructor Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleAddInstructor}
        >
          Add Instructor
        </Button>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Instructor Management Page
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          This page will include:
        </Typography>
        <Box component="ul" sx={{ textAlign: 'left', mt: 2, pl: 2 }}>
          <Box component="li">Add new instructors with validation</Box>
          <Box component="li">Edit existing instructors</Box>
          <Box component="li">Delete instructors (if not assigned to courses)</Box>
          <Box component="li">Search by name and job title</Box>
          <Box component="li">Pagination for instructor list</Box>
        </Box>
      </Paper>

      {/* Add Instructor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Instructor</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            autoFocus
            margin="dense"
            label="Instructor Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange('name')}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Job Title</InputLabel>
            <Select
              value={formData.jobTitle}
              onChange={handleInputChange('jobTitle')}
              label="Job Title"
            >
              <MenuItem value="FullstackDeveloper">Fullstack Developer</MenuItem>
              <MenuItem value="Backend">Backend Developer</MenuItem>
              <MenuItem value="BackendDeveloper">Backend Developer</MenuItem>
              <MenuItem value="Frontend">Frontend Developer</MenuItem>
              <MenuItem value="FrontendDeveloper">Frontend Developer</MenuItem>
              <MenuItem value="UIUX">UI/UX Designer</MenuItem>
              <MenuItem value="UXUIDesigner">UI/UX Designer</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Rating (0-5)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.rating}
            onChange={handleInputChange('rating')}
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.bio}
            onChange={handleInputChange('bio')}
            sx={{ mb: 2 }}
          />
          
          <ImageUpload
            value={formData.imagePath}
            onChange={(imageUrl: string) => setFormData(prev => ({ ...prev, imagePath: imageUrl }))}
            label="Instructor Image"
            error={error}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || !formData.name || !formData.jobTitle}
          >
            {loading ? (editingInstructor ? 'Updating...' : 'Adding...') : (editingInstructor ? 'Update Instructor' : 'Add Instructor')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Search Section */}
      <Box sx={{ mt: 4, mb: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Search Instructors
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Search by name or job title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
            >
              Clear Search
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Instructors List */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Instructors ({totalCount} total)
          </Typography>
        </Box>
        
        {loadingInstructors ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading instructors...
            </Typography>
          </Paper>
        ) : instructors.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No instructors found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "Add Instructor" to create your first instructor
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {instructors && instructors.map((instructor) => (
              <Box key={instructor.Id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={instructor.ImagePath?.startsWith('http') ? instructor.ImagePath : `http://mohamedexfs60-001-site1.mtempurl.com${instructor.ImagePath}` || '/placeholder-instructor.jpg'}
                    alt={instructor.Name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>
                      {instructor.Name}
                    </Typography>
                    
                    <Chip 
                      label={instructor.JobTitle} 
                      color="primary" 
                      size="small" 
                      sx={{ mb: 2, alignSelf: 'flex-start' }}
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                      {instructor.Bio}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={instructor.Rating || 0} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ⭐ {instructor.Rating || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditInstructor(instructor)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteInstructor(instructor)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
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
        onClose={cancelDelete}
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
            Instructor {instructorToDelete?.Name} ?
          </Typography>
        </Box>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={cancelDelete}
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
            onClick={confirmDeleteInstructor}
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

export default AdminInstructorsPage;