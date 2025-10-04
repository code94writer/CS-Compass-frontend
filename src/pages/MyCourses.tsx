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
  CircularProgress,
  Chip,
  Paper,
  Skeleton,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { getPurchasedPDFs, downloadPDF } from '../api/pdf';
import { I_PurchasedPDF } from '../types';
import { useAuth } from '../context/AuthContext';

const MyCourses: React.FC = () => {
  const [purchasedPDFs, setPurchasedPDFs] = useState<I_PurchasedPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchasedPDFs();
    } else {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const fetchPurchasedPDFs = async () => {
    try {
      const response = await getPurchasedPDFs();
      if (response?.data) {
        setPurchasedPDFs([]);
      } else {
        toast.error('Failed to fetch purchased PDFs');
      }
    } catch (error) {
      console.error('Error fetching purchased PDFs:', error);
      toast.error('An error occurred while fetching purchased PDFs');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdfId: string, pdfTitle: string) => {
    setDownloading(pdfId);
    try {
      const blob = await downloadPDF(pdfId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdfTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewDetails = (pdfId: string) => {
    navigate(`/pdf/${pdfId}`);
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Skeleton variant="rectangular" width={48} height={48} sx={{ mr: 2, borderRadius: 1 }} />
                <Skeleton variant="rounded" width={100} height={24} />
              </Box>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={120} height={36} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={4}>
          <Skeleton variant="text" width={300} height={48} />
          <Skeleton variant="text" width={400} height={24} sx={{ mt: 1 }} />
        </Box>
        <LoadingSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Purchased Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access and download your purchased PDF materials
        </Typography>
      </Box>

      {purchasedPDFs?.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <CartIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No purchased courses yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Browse our courses and make your first purchase to get started
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/courses')}
            startIcon={<CartIcon />}
          >
            Browse Courses
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>

          {purchasedPDFs?.map((pdf) => (
            <Grid item xs={12} sm={6} md={4} key={pdf.id}>
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
                        bgcolor: 'success.light',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <PdfIcon sx={{ color: 'success.main', fontSize: 24 }} />
                    </Box>
                    <Chip
                      label={`Purchased ${new Date(pdf.purchaseDate).toLocaleDateString()}`}
                      size="small"
                      variant="outlined"
                      color="success"
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom className="line-clamp-2">
                    {pdf.title}
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
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                      ₹{pdf.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Purchased
                    </Typography>
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(pdf.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={downloading === pdf.id ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                    onClick={() => handleDownload(pdf.id, pdf.title)}
                    disabled={downloading === pdf.id}
                  >
                    {downloading === pdf.id ? 'Downloading...' : 'Download'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCourses;
