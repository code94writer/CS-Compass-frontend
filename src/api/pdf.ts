import AxiosInstance from './axiosInstance';
import { I_PDF, I_UploadPDF } from '../types';
import { mockPDFs } from './mockData';

export const getPDFs = async (): Promise<{ data: I_PDF[] }> => {
  try {
    // For demo purposes, use mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockPDFs };
    
    // Uncomment below for real API calls
    // const response = await AxiosInstance.get('/pdfs');
    // return response;
  } catch (error: any) {
    console.error('getPDFs error', error);
    return error?.response;
  }
};

export const getPDFById = async (id: string): Promise<{ data: I_PDF }> => {
  try {
    // For demo purposes, use mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    const pdf = mockPDFs.find(p => p.id === id);
    if (!pdf) {
      throw new Error('PDF not found');
    }
    return { data: pdf };
    
    // Uncomment below for real API calls
    // const response = await AxiosInstance.get(`/pdfs/${id}`);
    // return response;
  } catch (error: any) {
    console.error('getPDFById error', error);
    return error?.response;
  }
};

export const uploadPDF = async (data: I_UploadPDF): Promise<{ data: I_PDF }> => {
  try {
    // For demo purposes, simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newPDF: I_PDF = {
      id: Date.now().toString(),
      title: data.title,
      description: 'Uploaded PDF document',
      url: '/api/pdfs/uploaded/download',
      uploadDate: new Date().toISOString(),
      size: data.file.size,
    };
    return { data: newPDF };
    
    // Uncomment below for real API calls
    // const formData = new FormData();
    // formData.append('title', data.title);
    // formData.append('file', data.file);
    // 
    // const response = await AxiosInstance.post('/pdfs/upload', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    // return response;
  } catch (error: any) {
    console.error('uploadPDF error', error);
    return error?.response;
  }
};

export const downloadPDF = async (id: string): Promise<Blob> => {
  try {
    // For demo purposes, create a mock PDF blob
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pdf = mockPDFs.find(p => p.id === id);
    if (!pdf) {
      throw new Error('PDF not found');
    }
    
    // Create a simple text file as mock PDF
    const content = `Mock PDF Content for: ${pdf.title}\n\nThis is a demo PDF file. In a real application, this would be the actual PDF content.`;
    return new Blob([content], { type: 'application/pdf' });
    
    // Uncomment below for real API calls
    // const response = await AxiosInstance.get(`/pdfs/${id}/download`, {
    //   responseType: 'blob',
    // });
    // return response.data;
  } catch (error: any) {
    console.error('downloadPDF error', error);
    throw error;
  }
};
