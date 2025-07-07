import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get the auth token from the store (or localStorage)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- AUTH ---
export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

// --- STATS ---
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats`, { headers: getAuthHeaders() });
  return response.data;
};

// --- WORKSHOPS ---
export const getAdminWorkshops = async () => {
    const response = await axios.get(`${API_BASE_URL}/workshops/admin`, { headers: getAuthHeaders() });
    return response.data;
};
export const createWorkshop = async (workshopData) => {
    const response = await axios.post(`${API_BASE_URL}/workshops`, workshopData, { headers: getAuthHeaders() });
    return response.data;
};

export const getWorkshopById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/workshops/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

export const softDeleteWorkshop = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/workshops/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

export const restoreWorkshop = async (id) => {
    const response = await axios.put(`${API_BASE_URL}/workshops/${id}/restore`, {}, { headers: getAuthHeaders() });
    return response.data;
};


// --- BOOKINGS ---
export const getAllBookings = async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/bookings`, { 
        headers: getAuthHeaders(),
        params, // For pagination and filtering e.g. { page: 1, limit: 10 }
    });
    return response.data;
};
export const updateBookingStatus = async (bookingId, status) => {
    const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}`, { status }, { headers: getAuthHeaders() });
    return response.data;
};