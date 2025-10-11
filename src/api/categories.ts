import AxiosInstance from './axiosInstance';

export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  parent_id?: string | null;
}

export const getCategories = async (): Promise<{data:Category[]}> => {
  const res = await AxiosInstance.get('/categories');
  return res.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await AxiosInstance.get(`/categories/${id}`);
  return res.data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const res = await AxiosInstance.post('/admin/categories', payload);
  return res.data;
};

export const updateCategory = async (id: string, payload: CategoryPayload): Promise<Category> => {
  const res = await AxiosInstance.put(`/admin/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/admin/categories/${id}`);
};
