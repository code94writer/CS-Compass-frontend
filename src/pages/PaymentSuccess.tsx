import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Download as DownloadIcon,
  Home as HomeIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Extract payment details from URL parameters
    const txnid = searchParams.get('txnid');
    const amount = searchParams.get('amount');
    const productinfo = searchParams.get('productinfo');
    const firstname = searchParams.get('firstname');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const payuMoneyId = searchParams.get('payuMoneyId');
    const hash = searchParams.get('hash');

    if (txnid && status) {
      setPaymentDetails({
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        status,
        payuMoneyId,
        hash,
      });

      if (status === 'success') {
        toast.success('Payment completed successfully!');
      } else {
        setError('Payment was not successful. Please try again.');
      }
    } else {
      setError('Invalid payment response. Please contact support.');
    }

    setLoading(false);
  }, [searchParams]);

  const handleViewCourse = () => {
    // Always redirect to my-courses page after successful payment
    navigate('/my-courses');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewMyCourses = () => {
    navigate('/my-courses');
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
            sx={{ mt: 2 }}
          >
            Go to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <SuccessIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'success.main' }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your payment has been processed successfully. You can now access your purchased course.
          </Typography>
        </Box>

        {paymentDetails && (
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paymentDetails.txnid}</Typography>
              </Box>
              {paymentDetails.payuMoneyId && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">PayU Money ID:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paymentDetails.payuMoneyId}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Amount:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{paymentDetails.amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Course:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paymentDetails.productinfo}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                <Chip label="Success" color="success" size="small" />
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleViewCourse}
            startIcon={<ViewIcon />}
            sx={{ py: 1.5 }}
          >
            View Course
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleViewMyCourses}
            startIcon={<DownloadIcon />}
            sx={{ py: 1.5 }}
          >
            My Courses
          </Button>
          <Button
            variant="text"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
