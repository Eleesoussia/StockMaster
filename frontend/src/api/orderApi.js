import api from './axiosConfig';

export const orderApi = {
  list: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};