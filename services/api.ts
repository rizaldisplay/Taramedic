import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  // baseURL: 'https://test.lemix.id/api',
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auto Inject Bearer Token jika ada di localStorage
api.interceptors.request.use((config) => {
  if(typeof window !== 'undefined'){
    const token= Cookies.get('access_token');
    if(token) config.headers.Authorization = `Bearer${token}`;
  }
  
  return config;
});