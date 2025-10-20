import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  People as UsersIcon,
  Assessment as StatsIcon,
  DisabledByDefault as DisabledIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  CurrencyRupee as RevenueIcon,
} from '@mui/icons-material';
import { getPDFs } from '../api/pdf';
import { I_PDF } from '../types';
import { isApiSuccess } from '../util/helper';
import Settings from './Settings';
import { getAdminStatistics, PlatformStatistics } from '../api/statistics';

const AdminDashboard: React.FC = () => {
  const [pdfs, setPdfs] = useState<I_PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<PlatformStatistics | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
    fetchStatistics();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response:any = await getPDFs();
      if ( isApiSuccess(response) ) {
        setPdfs(response.data.data);
      } else {
        toast.error('Failed to fetch PDFs');
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      toast.error('An error occurred while fetching PDFs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getAdminStatistics();
      if (isApiSuccess(response)) {
        setStatistics(response.data.data);
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const stats = [
    {
      title: 'Active Courses',
      value: statistics ? statistics.activeCourses : 0,
      icon: <StatsIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      color: 'primary.main',
    },
    {
      title: 'Active Users',
      value: statistics?.activeUsers || 0,
      icon: <UsersIcon sx={{ fontSize: 30, color: 'success.main' }} />,
      color: 'success.main',
    },
    {
      title: 'In-Active Courses',
      value: statistics?.nonActiveCourses || 0,
      icon: <DisabledIcon sx={{ fontSize: 30, color: 'error.main' }} />,
      color: 'error.main',
    },
    {
      title: 'Revenue',
      value: statistics ? `₹${statistics.totalRevenue.toLocaleString('en-IN')}` : '₹0',
      icon: <RevenueIcon sx={{ fontSize: 30, color: 'warning.main' }} />,
      color: 'warning.main',
    },
  ];

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
              <Skeleton variant="text" width={80} height={32} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage courses, users, and platform settings
        </Typography>
      </Box>

    

      {/* Statistics */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Platform Statistics
        </Typography>
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {stat.icon}
                      <Typography
                        variant="h6"
                        sx={{ ml: 2, fontWeight: 'bold', color: stat.color }}
                      >
                        {stat.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

  {/* Quick Actions */}
  <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Manage Courses
        </Typography>

        <Settings />
        
        {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/upload')}
            sx={{ px: 3 }}
          >
            Upload New Course
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => navigate('/upload')}
            sx={{ px: 3 }}
          >
            Manage Uploads
          </Button>
          <Button
            variant="outlined"
            startIcon={<StatsIcon />}
            onClick={() => navigate('/admin/analytics')}
            sx={{ px: 3 }}
          >
            View Analytics
          </Button>
        </Box> */}
      </Paper>

      {/* Recent Courses */}
      {/* <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Recent Courses
        </Typography>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Skeleton variant="rectangular" width={48} height={48} sx={{ mr: 2, borderRadius: 1 }} />
                      <Skeleton variant="text" width={100} height={24} />
                    </Box>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {pdfs.slice(0, 6).map((pdf) => (
              <Grid item xs={12} md={6} key={pdf.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'error.light',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <PdfIcon sx={{ color: 'error.main', fontSize: 24 }} />
                      </Box>
                      <Chip
                        label={new Date(pdf.created_at).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom className="line-clamp-2">
                      {pdf.name}
                    </Typography>
                    
                    {pdf.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="line-clamp-3"
                        sx={{ mb: 2 }}
                      >
                        {pdf.description}
                      </Typography>
                    )}
                    
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/pdf/${pdf.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate('/upload')}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box> */}
    </Container>
  );
};

export default AdminDashboard;
