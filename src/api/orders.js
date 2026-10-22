import client from '@/api/client';

const id = (value) => encodeURIComponent(value);
const toList = (data) => (Array.isArray(data) ? data : data?.orders || []);
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

// Le serveur calcule le prix et fixe le statut : le client n'envoie que sa demande
export const ordersAPI = {
  create: async (order) => {
    const { data } = await client.post('/orders', order);
    emit('newOrder', { order: data });
    return data;
  },
  getMine: async () => toList((await client.get('/orders/mine')).data),
  getAll: async (params = { limit: 100 }) => toList((await client.get('/orders', { params })).data),
  // Admin : en_attente | validee | rejetee | terminee (l'email au client est envoyé par le serveur)
  updateStatus: async (orderId, status, order = null) => {
    const { data } = await client.patch(`/orders/${id(orderId)}/status`, { status });
    emit('orderStatusUpdated', { orderId, status, order: order || data });
    return data;
  },
  cancel: async (orderId) => (await client.patch(`/orders/${id(orderId)}/cancel`)).data,
};

export default ordersAPI;
