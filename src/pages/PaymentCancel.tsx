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
  Chip,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Refresh as RetryIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Extract payment details from URL parameters
    const txnid = searchParams.get('txnid');
    const amount = searchParams.get('amount');
    const productinfo = searchParams.get('productinfo');
    const firstname = searchParams.get('firstname');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    setPaymentDetails({
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
    });

    toast.info('Payment was cancelled.');
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Extract course ID from localStorage or payment details
    const courseId = localStorage.getItem('currentCourseId');
    if (courseId) {
      navigate(`/pdf/${courseId}`);
    } else {
      navigate('/courses');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
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

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <CancelIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.main' }}>
            Payment Cancelled
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have cancelled the payment process. No charges have been made to your account.
          </Typography>
        </Box>

        {paymentDetails && (
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Transaction Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {paymentDetails.txnid && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Transaction ID:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paymentDetails.txnid}</Typography>
                </Box>
              )}
              {paymentDetails.amount && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Amount:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>₹{paymentDetails.amount}</Typography>
                </Box>
              )}
              {paymentDetails.productinfo && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Course:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{paymentDetails.productinfo}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                <Chip label="Cancelled" color="warning" size="small" />
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRetryPayment}
            startIcon={<RetryIcon />}
            sx={{ py: 1.5 }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleGoBack}
            startIcon={<BackIcon />}
            sx={{ py: 1.5 }}
          >
            Go Back
          </Button>
          <Button
            variant="text"
            onClick={handleGoHome}
            startIcon={<HomeIcon />}
          >
            Go to Home
          </Button>
        </Box>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Want to complete your purchase?</strong><br />
            You can return to the course page and try the payment again at any time.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentCancel;
