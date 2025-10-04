import AxiosInstance from './axiosInstance';
import { I_PDF, I_UploadPDF, I_PurchasedPDF } from '../types';

export const getPDFs = async (): Promise<{ data: I_PDF[] }> => {
  try {
    // GET /api/courses (AxiosInstance baseURL already includes /api)
    const response = await AxiosInstance.get('/courses');
    return response;
  } catch (error: any) {
    console.error('getPDFs error', error);
    return error?.response;
  }
};

export const getPDFById = async (id: string): Promise<{ data: I_PDF }> => {
  try {
    // GET /api/courses/{id}
    const response = await AxiosInstance.get(`/courses/${id}`);
    return response;
  } catch (error: any) {
    console.error('getPDFById error', error);
    return error?.response;
  }
};

export const uploadPDF = async (data: I_UploadPDF): Promise<{ data: I_PDF }> => {
  try {
    // Real multipart upload (adjust endpoint if backend differs)
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);

    const response = await AxiosInstance.post('/pdfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error('uploadPDF error', error);
    return error?.response;
  }
};

export const downloadPDF = async (id: string): Promise<Blob> => {
  try {
    // GET /api/courses/{id}/download
    const response = await AxiosInstance.get(`/courses/${id}/download`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  } catch (error: any) {
    console.error('downloadPDF error', error);
    throw error;
  }
};

// Fetch purchased PDFs for authenticated user
export const getPurchasedPDFs = async (): Promise<{ data: I_PurchasedPDF[] }> => {
  try {
    const response = await AxiosInstance.get('/courses/my');
    return response;
  } catch (error: any) {
    console.error('getPurchasedPDFs error', error);
    return error?.response || { data: [] };
  }
};

// Check if a specific PDF is purchased by the user
export const isPDFPurchased = async (pdfId: string): Promise<boolean> => {
  try {
    const response = await getPurchasedPDFs();
    if (response?.data) {
      return response.data.some((pdf: I_PurchasedPDF) => pdf.id === pdfId);
    }
    return false;
  } catch (error) {
    console.error('isPDFPurchased error', error);
    return false;
  }
};
