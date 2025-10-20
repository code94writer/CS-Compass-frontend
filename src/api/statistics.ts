import AxiosInstance from './axiosInstance';

export interface PlatformStatistics {
  activeCourses: number;
  activeUsers: number;
  nonActiveCourses: number;
  totalRevenue: number;
}

export const getAdminStatistics = async () => {
  const res = await AxiosInstance.get('/admin/statistics');
  return res;
};
