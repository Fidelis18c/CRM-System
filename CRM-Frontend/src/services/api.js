import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle sessions expired (401)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Handle global errors (e.g., backend down)
      console.error('API Error:', error.response.data.message || error.message);
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
