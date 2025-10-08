import AxiosInstance from './axiosInstance';
import { I_PaymentRequest, I_PayUInitiateRequest, I_PayUInitiateResponse } from '../types';

// PayU Payment Processing

// Process payment with PayU
export const processPayUPayment = async (
  courseId: string,
  onSuccess: (transactionId: string) => void,
  onError: (error: string) => void
) => {
  try {
    // Initiate payment with backend
    const response = await initiatePayUPayment({ courseId });

    if (response.success && response.data) {
      const { paymentUrl, paymentParams, merchantKey, transactionId } = response.data;

      // Store transaction ID for success callback
      localStorage.setItem('currentTransactionId', transactionId);

      // Submit form to PayU
      submitPayUForm(paymentUrl, paymentParams, merchantKey);

      // Call success callback with transaction ID
      onSuccess(transactionId);
    } else {
      onError(response.message || 'Failed to initiate payment');
    }
  } catch (error: any) {
    console.error('PayU payment processing error:', error);
    onError(error?.response?.data?.message || 'Failed to process payment');
  }
};

// PayU Payment Integration

// Initiate PayU payment
export const initiatePayUPayment = async (payload: I_PayUInitiateRequest): Promise<I_PayUInitiateResponse> => {
  try {
    const response = await AxiosInstance.post('/courses/payment/initiate', payload);
    return response.data;
  } catch (error) {
    console.error('Initiate PayU payment error:', error);
    throw error;
  }
};

// Create and submit PayU payment form
export const submitPayUForm = (paymentUrl: string, paymentParams: any, merchantKey: string) => {
  try {
    // Validate required parameters
    if (!paymentUrl || !paymentParams || !merchantKey) {
      throw new Error('Missing required payment parameters');
    }

    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;
    form.style.display = 'none';
    form.target = '_self'; // Ensure form submits in the same window

    // Add all payment parameters as hidden inputs
    const params = { ...paymentParams, key: merchantKey };

    // Required PayU parameters
    const requiredParams = ['txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'surl', 'furl', 'curl', 'hash'];

    // Validate required parameters exist
    for (const param of requiredParams) {
      if (!params[param]) {
        console.warn(`Missing required PayU parameter: ${param}`);
      }
    }

    Object.keys(params).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(params[key] || ''); // Ensure value is string
      form.appendChild(input);
    });

    // Append form to body and submit
    document.body.appendChild(form);

    console.log('Submitting PayU form with parameters:', Object.keys(params));
    form.submit();

    // Clean up after a short delay to ensure form submission
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    }, 1000);

  } catch (error) {
    console.error('Error submitting PayU form:', error);
    throw error;
  }
};

// Record a purchased course (after payment success) - kept for backward compatibility
export const purchaseCourse = async (payload: {
  courseId: string;
  amount: number;
  paymentId: string;
  expiryDate: string;
}) => {
  try {
    const response = await AxiosInstance.post('/courses/purchase', payload);
    return response?.data;
  } catch (error) {
    console.error('Purchase course error:', error);
    throw error;
  }
};


