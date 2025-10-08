import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard,
  School,
  Person,
  Category,
  ShoppingCart,
  Group,
  Assessment,
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { PlatformStats } from '../../types';

// Import admin sub-pages (we'll create these)
import AdminStatsPage from './AdminStatsPage';
import AdminInstructorsPage from './AdminInstructorsPage';
import AdminCoursesPage from './AdminCoursesPage';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine current tab based on route
  const getCurrentTab = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/admin/instructors')) return 1;
    if (path.includes('/admin/courses')) return 2;
    return 0; // Default to dashboard
  }, [location.pathname]);

  const [currentTab, setCurrentTab] = useState(getCurrentTab());

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setCurrentTab(getCurrentTab());
  }, [location.pathname, getCurrentTab]);

  const fetchStats = async () => {
    try {
      const statsData = await adminService.getPlatformStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);

    switch (newValue) {
      case 0:
        navigate('/admin');
        break;
      case 1:
        navigate('/admin/instructors');
        break;
      case 2:
        navigate('/admin/courses');
        break;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
        Admin Dashboard
      </Typography>

      {/* Stats Cards - Show on all admin pages */}
      {stats && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.TotalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <School sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.TotalCourses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Courses
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.TotalInstructors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Instructors
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Category sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.TotalCategories}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Categories
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 19.2px)' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stats.TotalOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month Orders
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab
            label="Dashboard"
            icon={<Assessment />}
          />
          <Tab
            label="Instructors"
            icon={<Person />}
          />
          <Tab
            label="Courses"
            icon={<School />}
          />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Routes>
        <Route index element={<AdminStatsPage stats={stats} />} />
        <Route path="instructors" element={<AdminInstructorsPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
      </Routes>
    </Container>
  );
};

export default AdminDashboard;