import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://codforg.vercel.app'  // Updated Vercel backend URL
  : 'http://localhost:3001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
