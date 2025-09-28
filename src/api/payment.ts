import AxiosInstance from './axiosInstance';
import { I_PaymentRequest } from '../types';

// Razorpay configuration
export const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890';

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (paymentData: I_PaymentRequest) => {
  try {
    const response = await AxiosInstance.post('/payment/create-order', paymentData);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  try {
    const response = await AxiosInstance.post('/payment/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw error;
  }
};

// Process payment with Razorpay
export const processPayment = async (
  paymentData: I_PaymentRequest,
  onSuccess: (paymentId: string) => void,
  onError: (error: string) => void
) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError('Failed to load payment gateway');
      return;
    }

    // Create order
    const order = await createRazorpayOrder(paymentData);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: paymentData.amount * 100, // Convert to paise
      currency: paymentData.currency,
      name: 'Course PDF App',
      description: `Purchase: ${paymentData.customerName}`,
      order_id: order.id,
      prefill: {
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        contact: paymentData.customerMobile,
      },
      theme: {
        color: '#1976d2',
      },
      handler: async (response: any) => {
        try {
          // Verify payment
          const verification = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verification.success) {
            onSuccess(response.razorpay_payment_id);
          } else {
            onError('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          onError('Payment verification failed');
        }
      },
      modal: {
        ondismiss: () => {
          onError('Payment cancelled');
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment processing error:', error);
    onError('Failed to process payment');
  }
};

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}
