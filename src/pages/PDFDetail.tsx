import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getPDFById, downloadPDF } from '../api/pdf';
import { I_PDF } from '../types';

const PDFDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<I_PDF | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPDF();
    }
  }, [id]);

  const fetchPDF = async () => {
    try {
      const response = await getPDFById(id!);
      if (response?.data) {
        setPdf(response.data);
      } else {
        toast.error('Failed to fetch PDF details');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
      toast.error('An error occurred while fetching PDF details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdf) return;

    setDownloading(true);
    try {
      const blob = await downloadPDF(pdf.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!pdf) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            PDF not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'error.light',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
              }}
            >
              <PdfIcon sx={{ color: 'error.main', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {pdf.title}
              </Typography>
              <Chip
                label={`Uploaded on ${new Date(pdf.uploadDate).toLocaleDateString()}`}
                variant="outlined"
                color="primary"
              />
            </Box>
          </Box>
          <IconButton
            onClick={() => navigate('/')}
            color="inherit"
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {pdf.description && (
          <Box mb={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {pdf.description}
            </Typography>
          </Box>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  File Information
                </Typography>
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      File Size:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {(pdf.size / 1024 / 1024).toFixed(1)} MB
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Upload Date:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(pdf.uploadDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      File Type:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      PDF Document
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Actions
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  onClick={handleDownload}
                  disabled={downloading}
                  sx={{ mt: 2 }}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-start">
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PDFDetail;
