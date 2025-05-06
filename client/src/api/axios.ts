import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};
    
    
    if (data?.message) {
      toast.error(data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    
    if (status === 401) {
      
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 