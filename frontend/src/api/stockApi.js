import api from './axiosConfig';

export const stockApi = {
  createMovement: (data) => api.post('/stock/movements', data),
  listMovements: (params) => api.get('/stock/movements', { params }),
  listAlerts: (params) => api.get('/stock/alerts', { params }),
  markAlertRead: (id) => api.patch(`/stock/alerts/${id}/read`),
};