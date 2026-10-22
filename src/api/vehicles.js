import client from '@/api/client';

const unwrap = (promise) => promise.then((response) => response.data);
const id = (value) => encodeURIComponent(value);

export const vehiclesAPI = {
  getAll: (params = { limit: 100 }) => unwrap(client.get('/vehicles', { params })),
  getById: (vehicleId) => unwrap(client.get(`/vehicles/${id(vehicleId)}`)),
  // Admin uniquement (contrôlé par le serveur)
  create: (vehicle) => unwrap(client.post('/vehicles', vehicle)),
  update: (vehicleId, vehicle) => unwrap(client.put(`/vehicles/${id(vehicleId)}`, vehicle)),
  remove: (vehicleId) => unwrap(client.delete(`/vehicles/${id(vehicleId)}`)),
};

export default vehiclesAPI;
