import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Add token to headers
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect on 401
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'; // force redirect
    }
    return Promise.reject(error);
  }
);

export default API;