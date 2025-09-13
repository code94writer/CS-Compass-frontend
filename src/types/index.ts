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
  title: string;
  description?: string;
  url: string;
  uploadDate: string;
  size: number;
}

export interface I_UploadPDF {
  title: string;
  file: File;
}
