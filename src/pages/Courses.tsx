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
} from '@mui/icons-material';
import { getPDFs } from '../api/pdf';
import { I_PDF } from '../types';
import { isApiSuccess } from '../util/helper';

const Courses: React.FC = () => {
  const [pdfs, setPdfs] = useState<I_PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response:any = await getPDFs();
      if (isApiSuccess(response)) {
        const pdfs = response.data.data
        setPdfs(pdfs);
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

  const handlePDFClick = (pdfId: string) => {
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
          Available Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Click on a course to view details and download
        </Typography>
      </Box>

      {pdfs.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new content
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pdfs.map((pdf:I_PDF) => (
            <Grid item xs={12} sm={6} md={4} key={pdf.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handlePDFClick(pdf.id)}
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
                  
                  {/* <Typography variant="caption" color="text.secondary">
                    {(pdf.price / 1024 / 1024).toFixed(1)} MB
                  </Typography> */}
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePDFClick(pdf.id);
                    }}
                  >
                    View Details
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

export default Courses;