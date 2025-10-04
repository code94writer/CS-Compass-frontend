import AxiosInstance from './axiosInstance';
import { I_Signin, I_LoginResponse, I_OTPRequest, I_OTPVerify, I_OTPResponse } from '../types';


export const signin = async (data: I_Signin): Promise<{ data: I_LoginResponse }> => {
  try {
    // Backend expects emailOrPhone + password
    const payload = {
      emailOrPhone: data.email,
      password: data.password,
    };

    const response = await AxiosInstance.post('/auth/login', payload);
    return { data: response.data as I_LoginResponse };
  } catch (error: any) {
    console.error('signin error', error);
    return error?.response;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// OTP-based authentication for users
export const sendOTP = async (data: I_OTPRequest): Promise<{ status: number; data: I_OTPResponse }> => {
  try {
    // Normalize Indian numbers: accept 10-digit input and prefix +91
    const normalizedMobile = (() => {
      const digitsOnly = (data.mobile || '').replace(/\D/g, '');
      if (digitsOnly.length === 10) return `+91${digitsOnly}`;
      if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return `+${digitsOnly}`;
      if (digitsOnly.startsWith('91') && digitsOnly.length > 12) return `+${digitsOnly}`;
      if (data.mobile.startsWith('+')) return data.mobile;
      return `+${data.mobile}`;
    })();

    const response = await AxiosInstance.post('/auth/send-otp', { mobile: normalizedMobile });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    console.error('sendOTP error', error);
    return {
      status: error?.response?.status || 500,
      data: error?.response?.data || { success: false, message: 'Failed to send OTP' }
    };
  }
};

export const verifyOTP = async (data: I_OTPVerify): Promise<{ status: number; data: I_OTPResponse }> => {
  try {
    // Normalize Indian numbers as in sendOTP
    const normalizedMobile = (() => {
      const digitsOnly = (data.mobile || '').replace(/\D/g, '');
      if (digitsOnly.length === 10) return `+91${digitsOnly}`;
      if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return `+${digitsOnly}`;
      if (digitsOnly.startsWith('91') && digitsOnly.length > 12) return `+${digitsOnly}`;
      if (data.mobile.startsWith('+')) return data.mobile;
      return `+${data.mobile}`;
    })();

    const response = await AxiosInstance.post('/auth/verify-otp', { ...data, mobile: normalizedMobile });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    console.error('verifyOTP error', error);
    return {
      status: error?.response?.status || 500,
      data: error?.response?.data || { success: false, message: 'Failed to verify OTP' }
    };
  }
};
