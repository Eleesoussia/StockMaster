import api from './axiosConfig';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  listUsers: () => api.get('/auth/users'),
  updateRole: (id, role) => api.patch(`/auth/users/${id}/role`, { role }),
  toggleActive: (id) => api.patch(`/auth/users/${id}/toggle`),
};