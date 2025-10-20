import AxiosInstance from './axiosInstance';

export interface CoursePayload {
  name: string;
  description: string;
  category_id: string;
  aboutCreator: string;
  price: number;
  discount: number;
  offer: Record<string, any>;
  expiry?: string; // ISO datetime
}

export const createCourse = async (payload: CoursePayload) => {
  const res = await AxiosInstance.post('/admin/courses', payload);
  return res;
};

export const updateCourse = async (id: string, payload: CoursePayload) => {
  const res = await AxiosInstance.put(`/admin/courses/${id}`, payload);
  return res;
};

export const deleteCourse = async (id: string) => {
  const res = await AxiosInstance.delete(`/admin/courses/${id}`);
  return res;
};

export const deactivateCourse = async (id: string) => {
  // POST to deactivate a course
  const res = await AxiosInstance.post(`/admin/courses/${id}/deactivate`);
  return res;
};

export const reactivateCourse = async (id: string) => {
  // POST to reactivate a course (do not include extra /api because baseURL already has it)
  const res = await AxiosInstance.post(`/admin/courses/${id}/reactivate`);
  return res;
};

export const uploadCourseThumbnail = async (courseId: string, file: File) => {
  try {
    const form = new FormData();
    // Try with 'thumbnail' key
    form.append('thumbnail', file, file.name);
    const res = await AxiosInstance.post(`/admin/courses/${courseId}/thumbnail`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
    });
    return res;
  } catch (e: any) {
    // Fallback: some servers expect 'file'
    try {
      const form2 = new FormData();
      form2.append('file', file, file.name);
      const res2 = await AxiosInstance.post(`/admin/courses/${courseId}/thumbnail`, form2, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
      });
      return res2;
    } catch (e2: any) {
      return e2?.response || e?.response;
    }
  }
};

export const deleteCourseThumbnail = async (courseId: string) => {
  try {
    const res = await AxiosInstance.delete(`/admin/courses/${courseId}/thumbnail`);
    return res;
  } catch (e: any) {
    return e?.response;
  }
};

export const getCourseThumbnailUrl = (courseId: string): string => {
  const baseURL = process.env.REACT_APP_API_URL || 'https://api.civilservicescompass.com/api';
  return `${baseURL}/courses/${courseId}/thumbnail`;
};
