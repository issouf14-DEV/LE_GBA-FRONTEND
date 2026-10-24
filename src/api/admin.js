import client from '@/api/client';
import { fetchAllPages } from '@/api/pagination';

const id = (value) => encodeURIComponent(value);

export const adminAPI = {
  // Tous les utilisateurs, page par page (le serveur limite à 100 par page)
  getUsers: () =>
    fetchAllPages(async (params) => (await client.get('/admin/users', { params })).data, 'users'),
  getStats: async () => (await client.get('/admin/stats')).data,
  createUser: async (user) => (await client.post('/admin/users', user)).data,
  updateUserRole: async (userId, role) =>
    (await client.put(`/admin/users/${id(userId)}`, { role })).data,
  deleteUser: async (userId) => (await client.delete(`/admin/users/${id(userId)}`)).data,
};

export default adminAPI;
