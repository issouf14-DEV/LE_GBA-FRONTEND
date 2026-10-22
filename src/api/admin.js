import client from '@/api/client';

const id = (value) => encodeURIComponent(value);
const toList = (data, key) => (Array.isArray(data) ? data : data?.[key] || []);

export const adminAPI = {
  getUsers: async (params = { page: 1, limit: 50 }) =>
    toList((await client.get('/admin/users', { params })).data, 'users'),
  createUser: async (user) => (await client.post('/admin/users', user)).data,
  updateUserRole: async (userId, role) =>
    (await client.put(`/admin/users/${id(userId)}`, { role })).data,
  deleteUser: async (userId) => (await client.delete(`/admin/users/${id(userId)}`)).data,
};

export default adminAPI;
