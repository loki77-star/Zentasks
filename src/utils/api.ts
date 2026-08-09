import axios from 'axios';

const getBaseURL = () => {
  let url = process.env.NEXT_PUBLIC_API_URL;
  if (url) {
    // If the configured URL is missing the global prefix, append it automatically
    if (!url.includes('/api/backend')) {
      url = url.replace(/\/$/, '') + '/api/backend';
    }
    return url;
  }
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      // Accessed from mobile/network - use the browser's hostname with backend port 3001
      return `http://${window.location.hostname}:3001/api/backend`;
    }
  }
  return 'http://localhost:3001/api/backend';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Avoid redirecting if we are already on the login page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
