import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Phone as PhoneIcon, Security as SecurityIcon } from '@mui/icons-material';
import { sendOTP, verifyOTP } from '../api/auth';
import { I_OTPRequest, I_OTPVerify } from '../types';
import { useAuth } from '../context/AuthContext';

interface OTPLoginProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (token: string, mobile: string) => void;
  pdfTitle?: string;
}

const OTPLogin: React.FC<OTPLoginProps> = ({ open, onClose, onSuccess, pdfTitle }) => {
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { loginWithToken } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleClose = () => {
    setStep(0);
    setMobile('');
    setOtp('');
    setError('');
    setCountdown(0);
    onClose();
  };

  const handleSendOTP = async () => {
    if (!mobile.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    // Accept Indian 10-digit numbers; UI only requires 10 digits
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setError('Enter a 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData: I_OTPRequest = {
        mobile: digitsOnly, // backend layer will add +91
      };

      const response = await sendOTP(requestData);
      
      // Debug logging
      console.log('OTP Response:', response);
      console.log('Status:', response?.status);
      console.log('Data:', response?.data);
      console.log('Success:', response?.data?.success);
      
      // Check for status code 200 - if API returns 200, consider it successful
      if (response?.status === 200) {
        setStep(1);
        setCountdown(60);
        toast.success('OTP sent successfully!');
      } else {
        setError(response?.data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('An error occurred while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData: I_OTPVerify = {
        mobile: mobile.replace(/\D/g, ''), // backend layer will add +91
        code: otp,
      };

      const response = await verifyOTP(requestData);
      
      // Debug logging
      console.log('Verify OTP Response:', response);
      console.log('Status:', response?.status);
      console.log('Data:', response?.data);
      
      // Check for status code 200 - if API returns 200, consider it successful
      if (response?.status === 200) {
        // Try to get token from different possible locations
        const token = response?.data?.token || '';
        if (token) {
          // Login with token
          loginWithToken(token);
          toast.success('Login successful!');
          const mobileDigits = mobile.replace(/\D/g, '');
          onSuccess(token, mobileDigits);
          handleClose();
        } else {
          setError('No token received from server');
        }
      } else {
        setError(response?.data?.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setCountdown(0);
    setOtp('');
    setError('');
    handleSendOTP();
  };

  const steps = ['Enter Mobile', 'Verify OTP'];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <SecurityIcon color="primary" />
          <Typography variant="h6" component="div">
            {pdfTitle ? `Login to Purchase: ${pdfTitle}` : 'Login to Continue'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your mobile number to receive an OTP for secure login
            </Typography>
            <TextField
              fullWidth
              label="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              disabled={loading}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit OTP sent to {mobile}
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              disabled={loading}
              inputProps={{ maxLength: 6 }}
              sx={{ mb: 2 }}
            />
            {countdown > 0 && (
              <Typography variant="caption" color="text.secondary">
                Resend OTP in {countdown} seconds
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {step === 0 ? (
          <Button
            onClick={handleSendOTP}
            variant="contained"
            disabled={loading || !mobile.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {countdown === 0 && (
              <Button
                onClick={handleResendOTP}
                variant="outlined"
                disabled={loading}
              >
                Resend OTP
              </Button>
            )}
            <Button
              onClick={handleVerifyOTP}
              variant="contained"
              disabled={loading || !otp.trim() || otp.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OTPLogin;
