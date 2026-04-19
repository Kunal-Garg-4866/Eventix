import { api } from './client.js'

export const authApi = {
  signup: (body) => api.post('/auth/signup', body),
  login: (body) => api.post('/auth/login', body),
  me: () => api.get('/auth/me'),
}

export const societiesApi = {
  list: () => api.get('/societies'),
  mine: () => api.get('/societies/mine'),
  create: (body) => api.post('/societies', body),
  updateMine: (body) => api.put('/societies/mine', body),
}

export const eventsApi = {
  list: (params) => api.get('/events', { params }),
  get: (id) => api.get(`/events/${id}`),
  managed: () => api.get('/events/managed'),
  create: (body) => api.post('/events', body),
  update: (id, body) => api.put(`/events/${id}`, body),
  remove: (id) => api.delete(`/events/${id}`),
}

export const registrationsApi = {
  mine: () => api.get('/registrations/me'),
  register: (eventId, body) => api.post(`/registrations/events/${eventId}`, body),
  forEvent: (eventId) => api.get(`/registrations/events/${eventId}`),
}

export const dutyLeavesApi = {
  apply: (body) => api.post('/duty-leaves', body),
  mine: () => api.get('/duty-leaves/me'),
  society: () => api.get('/duty-leaves/society'),
  setStatus: (id, status) => api.patch(`/duty-leaves/${id}/status`, { status }),
}
