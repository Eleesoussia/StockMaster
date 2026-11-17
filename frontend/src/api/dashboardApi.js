import api from './axiosConfig';

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
  salesByDay: (period = '7days') => api.get('/dashboard/sales-by-day', { params: { period } }),
  topProducts: (limit = 5) => api.get('/dashboard/top-products', { params: { limit } }),
  productsByCategory: () => api.get('/dashboard/products-by-category'),
};