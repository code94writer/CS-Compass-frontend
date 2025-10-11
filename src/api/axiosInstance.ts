import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.civilservicescompass.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
AxiosInstance.interceptors.request.use(
  (config) => {
    // Support both admin token ('token') and OTP token ('userToken')
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, let the browser set the multipart boundary
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers && 'Content-Type' in config.headers) {
        delete (config.headers as any)['Content-Type'];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      // Do not hard redirect here; let route guards/pages decide navigation to avoid full reloads
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
