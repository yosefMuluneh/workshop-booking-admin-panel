// src/api/authApi.js
import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};