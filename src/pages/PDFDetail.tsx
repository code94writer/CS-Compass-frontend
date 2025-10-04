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
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { getPDFById, downloadPDF, isPDFPurchased } from '../api/pdf';
import { I_PDF, I_PaymentRequest } from '../types';
import OTPLogin from '../components/OTPLogin';
import { processPayment } from '../api/payment';
import { useAuth } from '../context/AuthContext';
import { isApiSuccess } from '../util/helper';

const PDFDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userToken, isAuthenticated, isAdmin } = useAuth();
  const [pdf, setPdf] = useState<I_PDF | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showOTPLogin, setShowOTPLogin] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPDF();
    }
  }, [id]);

  useEffect(() => {
    if (pdf && isAuthenticated && userToken) {
      checkIfPurchased();
    }
  }, [pdf, isAuthenticated, userToken]);

  const fetchPDF = async () => {
    try {
      const response:any = await getPDFById(id!);
      if (isApiSuccess(response)) {
        setPdf(response.data.data);
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

  const checkIfPurchased = async () => {
    if (!pdf?.id) return;
    
    setCheckingPurchase(true);
    try {
      const isPurchased = await isPDFPurchased(pdf.id);
      setPurchased(isPurchased);
    } catch (error) {
      console.error('Error checking purchase status:', error);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const handleDownload = async () => {
    if (!pdf) return;

    // Check if user has purchased the PDF
    if (!purchased) {
      toast.error('Please purchase the PDF first to download it');
      return;
    }

    setDownloading(true);
    try {
      const blob = await downloadPDF(pdf.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf.name}.pdf`;
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

  const handlePurchase = () => {
    setShowOTPLogin(true);
  };

  const handleOTPSuccess = (token: string, mobile: string) => {
    setShowOTPLogin(false);
    // Immediately start Razorpay payment with minimal required info
    startPaymentWithMobile(mobile);
  };

  const startPaymentWithMobile = async (mobile: string) => {
    if (!pdf) return;

    setProcessingPayment(true);

    // Minimal prefill: use mobile; synthesize name/email for Razorpay prefill
    const customerName = 'Customer';
    const customerEmail = `user_${mobile}@example.com`;

    const paymentData: I_PaymentRequest = {
      amount: 99,
      currency: 'INR',
      orderId: `order_${Date.now()}`,
      customerId: `customer_${Date.now()}`,
      customerName,
      customerEmail,
      customerMobile: mobile,
    };

    try {
      await processPayment(
        paymentData,
        async () => {
          setPurchased(true);
          toast.success('Payment successful! You can now download the PDF.');
          await checkIfPurchased();
        },
        (error) => {
          toast.error(error);
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // No customer info form: payment starts directly after OTP verification

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
                {pdf.name}
              </Typography>
              <Chip
                label={`Uploaded on ${new Date(pdf.created_at).toLocaleDateString()}`}
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
                     0 MB
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Upload Date:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {new Date(pdf.created_at).toLocaleDateString()}
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
                  {checkingPurchase ? 'Checking...' : purchased ? 'Download' : isAdmin ? 'Admin' : 'Purchase'}
                </Typography>
                {checkingPurchase ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Checking purchase status...
                    </Typography>
                  </Box>
                ) : purchased ? (
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
                ) : (
                  <Box>
                    {/* Hide purchase option for admins */}
                    {!isAdmin && (
                      <>
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ₹99
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            One-time purchase
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<CartIcon />}
                          onClick={handlePurchase}
                          sx={{ mt: 2 }}
                        >
                          Purchase PDF
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                          Secure payment with OTP verification
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                          Purchase required to download this PDF
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
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

      {/* OTP Login Dialog */
      }
      <OTPLogin
        open={showOTPLogin}
        onClose={() => setShowOTPLogin(false)}
        onSuccess={handleOTPSuccess}
        pdfTitle={pdf?.name}
      />
      {/* Payment dialog removed: we start Razorpay immediately after OTP success */}
    </Container>
  );
};

export default PDFDetail;
