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
  Error as ErrorIcon,
  Refresh as RetryIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

const PaymentFailure: React.FC = () => {
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
    const error = searchParams.get('error');
    const error_Message = searchParams.get('error_Message');

    setPaymentDetails({
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      error,
      error_Message,
    });

    toast.error('Payment failed. Please try again.');
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Redirect to courses page after payment failure
    navigate('/courses');
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
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
            Payment Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're sorry, but your payment could not be processed. Please try again or contact support if the issue persists.
          </Typography>
        </Box>

        {paymentDetails && (
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
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
                <Chip label="Failed" color="error" size="small" />
              </Box>
              {paymentDetails.error_Message && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="error">
                    <Typography variant="body2">
                      <strong>Error:</strong> {paymentDetails.error_Message}
                    </Typography>
                  </Alert>
                </Box>
              )}
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
            <strong>Need Help?</strong><br />
            If you continue to experience issues, please contact our support team with your transaction ID.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentFailure;
