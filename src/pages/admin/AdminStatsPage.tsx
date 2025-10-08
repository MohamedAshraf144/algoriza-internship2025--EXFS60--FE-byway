import React, { useState, useEffect } from 'react';
import {
  Typography,
  GridLegacy as Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { PlatformStats, User, Order } from '../../types';

interface AdminStatsPageProps {
  stats: PlatformStats | null;
}

const AdminStatsPage: React.FC<AdminStatsPageProps> = ({ stats }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  const fetchAdditionalData = async () => {
    try {
      const [usersData, ordersData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllOrders()
      ]);

      setUsers(usersData); // Show all users
      setOrders(ordersData); // Show all orders
    } catch (error) {
      console.error('Error fetching additional data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
        Platform Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Revenue Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ${(stats.MonthlyRevenue || 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {stats.TotalOrders} orders this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Growth Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Growth
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                +{Math.round((stats.TotalUsers / 10))}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User growth this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Users
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users && users.length > 0 ? users.map((user) => (
                        <TableRow key={user.Id}>
                          <TableCell>
                            {user.FirstName} {user.LastName}
                          </TableCell>
                          <TableCell>{user.Email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.Role}
                              size="small"
                              color={user.Role === 'Admin' ? 'error' : 'primary'}
                            />
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Orders
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders && orders.length > 0 ? orders.map((order) => (
                        <TableRow key={order.Id}>
                          <TableCell>#{order.Id}</TableCell>
                          <TableCell>${order.FinalAmount}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.Status}
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(order.OrderDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatsPage;