import AxiosInstance from './axiosInstance';
import { I_Signin, I_LoginResponse } from '../types';
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
