export interface I_Signin {
  email: string;
  password: string;
}

export interface I_LoginResponse {
  code: string;
  subscription: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface I_PDF {
    id: string;
    name: string;
    description: string;
    url: string;
    created_at: string;
    price: number;
}

export interface I_UploadPDF {
  title: string;
  file: File;
}

export interface I_OTPRequest {
  mobile: string;
}

export interface I_OTPVerify {
  mobile: string;
  code: string;
}

export interface I_OTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface I_PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
}

// PayU Payment Interfaces
export interface I_PayUPaymentParams {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  curl: string;
  udf1: string;
  udf2: string;
  hash: string;
}

export interface I_PayUCourse {
  id: string;
  name: string;
  price: string;
  discount: string;
  finalAmount: number;
}

export interface I_PayUInitiateResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    paymentUrl: string;
    paymentParams: I_PayUPaymentParams;
    merchantKey: string;
    course: I_PayUCourse;
  };
  timestamp: string;
  status: number;
}

export interface I_PayUInitiateRequest {
  courseId: string;
}

export interface I_PurchasedPDF {
  id: string;
  title: string;
  description?: string;
  url: string;
  purchaseDate: string;
  price: number;
}