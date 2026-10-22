import client from '@/api/client';

// La session est portée par des cookies httpOnly : aucune de ces réponses ne contient de token
export const authAPI = {
  register: (userData) => client.post('/auth/register', userData),
  login: (credentials) => client.post('/auth/login', credentials),
  logout: () => client.post('/auth/logout'),
  getProfile: () => client.get('/auth/profile'),
  updateProfile: (payload) => client.put('/auth/profile', payload),
  changePassword: (payload) => client.put('/auth/password', payload),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  // Le token voyage dans le corps de la requête, jamais dans l'URL (logs, proxys)
  resetPassword: (token, password) => client.post('/auth/reset-password', { token, password }),
};

export default authAPI;
