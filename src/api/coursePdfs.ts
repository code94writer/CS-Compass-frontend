import AxiosInstance from './axiosInstance';

export interface CoursePDFItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  created_at?: string;
}

export const listCoursePDFs = async (courseId: string): Promise<{ data: CoursePDFItem[] } | any> => {
  try {
    const res = await AxiosInstance.get(`/admin/courses/${courseId}/pdfs`);
    return res;
  } catch (e: any) {
    return e?.response;
  }
};

export const createCoursePDF = async (courseId: string, file: File, title: string, description?: string) => {
  try {
    const form = new FormData();
    // include filename to help backend parsers
    form.append('pdf', file, file.name);
    form.append('title', title);
    if (description) form.append('description', description);
    // let Axios/browser set multipart boundary automatically
    const res = await AxiosInstance.post(`/admin/courses/${courseId}/pdfs`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
    });
    return res;
  } catch (e: any) {
    // Fallback: some backends expect 'file' instead of 'pdf'
    // try {
    //   const form2 = new FormData();
    //   form2.append('file', file, file.name);
    //   form2.append('title', title);
    //   if (description) form2.append('description', description);
    //   const res2 = await AxiosInstance.post(`/admin/courses/${courseId}/pdfs`, form2, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //     maxBodyLength: Infinity,
    //   });
    //   return res2;
    // } catch (e2: any) {
    //   return e2?.response || e?.response;
    // }
    console.log(e);
  }
};

export const updateCoursePDF = async (
  courseId: string,
  pdfId: string,
  payload: { file?: File; title: string; description?: string }
) => {
  try {
    const form = new FormData();
    // file is optional on edit
    if (payload.file) form.append('pdf', payload.file, payload.file.name);
    form.append('title', payload.title);
    if (payload.description) form.append('description', payload.description);
    // let Axios set headers
    const res = await AxiosInstance.put(`/admin/courses/${courseId}/pdfs/${pdfId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
    });
    return res;
  } catch (e: any) {
    // Fallback with 'file' key
    if (payload.file) {
      try {
        const form2 = new FormData();
        form2.append('file', payload.file, payload.file.name);
        form2.append('title', payload.title);
        if (payload.description) form2.append('description', payload.description);
        const res2 = await AxiosInstance.put(`/admin/courses/${courseId}/pdfs/${pdfId}`, form2, {
          headers: { 'Content-Type': 'multipart/form-data' },
          maxBodyLength: Infinity,
        });
        return res2;
      } catch (e2: any) {
        return e2?.response || e?.response;
      }
    }
    return e?.response;
  }
};

export const deleteCoursePDF = async (courseId: string, pdfId: string) => {
  try {
    const res = await AxiosInstance.delete(`/admin/courses/${courseId}/pdfs/${pdfId}`);
    return res;
  } catch (e: any) {
    return e?.response;
  }
};
