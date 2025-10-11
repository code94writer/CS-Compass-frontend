import AxiosInstance from './axiosInstance';

export interface CoursePayload {
  name: string;
  description: string;
  category_id: string;
  aboutCreator: string;
  price: number;
  discount: number;
  offer: Record<string, any>;
  expiry: string; // ISO datetime
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
