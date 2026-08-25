import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.url.startsWith('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const crewApi = {
  getAll: () => api.get('/crews'),
};

export const userApi = {
  create: (data) => api.post('/users', {
    name: data.name,
    crewId: data.crewId || data.crew,
    crew: data.crewId || data.crew
  }),
};

export const milestoneApi = {
  getAll: () => api.get('/milestones'),
};

export const eventApi = {
  getConfig: () => api.get('/event-config'),
  getReveal: (attemptId) => api.get(`/event-config/reveal?attemptId=${attemptId}`),
};

export const attemptApi = {
  start: (userId) => api.post('/attempts/start', { userId, user: userId }),
  complete: (attemptId, data) => api.post(`/attempts/${attemptId}/complete`, data),
  get: (attemptId) => api.get(`/attempts/${attemptId}`),
};

export const leaderboardApi = {
  get: () => api.get('/leaderboard'),
};

export const adminApi = {
  login: (data) => api.post('/admin/login', data),
  getMilestones: () => api.get('/admin/milestones'),
  updateMilestone: (id, data) => api.put(`/admin/milestones/${id}`, data),
  getEventConfig: () => api.get('/admin/event-config'),
  updateEventConfig: (data) => api.put('/admin/event-config', data),
  getCrews: () => api.get('/admin/crews'),
  createCrew: (data) => api.post('/admin/crews', data),
  updateCrew: (id, data) => api.put(`/admin/crews/${id}`, data),
  deleteCrew: (id) => api.delete(`/admin/crews/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getAttempts: (params) => api.get('/admin/attempts', { params }),
  deleteAttempt: (id) => api.delete(`/admin/attempts/${id}`),
  exportCsv: () => api.get('/admin/attempts/csv', { responseType: 'blob' }),
  resetDb: (data) => api.post('/admin/reset-db', data),
};

export default api;
