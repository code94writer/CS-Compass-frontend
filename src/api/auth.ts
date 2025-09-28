import AxiosInstance from './axiosInstance';
import { I_Signin, I_LoginResponse, I_OTPRequest, I_OTPVerify, I_OTPResponse } from '../types';
import { mockLoginResponses } from './mockData';

export const signin = async (data: I_Signin): Promise<{ data: I_LoginResponse }> => {
  try {
    // For demo purposes, use mock data
    const mockResponse = mockLoginResponses[data.email];
    if (mockResponse) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: mockResponse };
    } else {
      throw new Error('Invalid credentials');
    }
    
    // Uncomment below for real API calls
    // const response = await AxiosInstance.post('/auth/login', data);
    // return response;
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
    const response = await AxiosInstance.post('/auth/send-otp', data);
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
    const response = await AxiosInstance.post('/auth/verify-otp', data);
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
