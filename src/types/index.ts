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

export interface I_PurchasedPDF {
  id: string;
  title: string;
  description?: string;
  url: string;
  purchaseDate: string;
  price: number;
}