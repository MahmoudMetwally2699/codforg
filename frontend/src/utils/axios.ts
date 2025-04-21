import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://codforg-fzerokgvz-mahmoudmetwally2699s-projects.vercel.app'  // Your Vercel backend URL
  : 'http://localhost:3001';

const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
