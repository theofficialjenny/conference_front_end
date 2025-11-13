import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// LOGIN
export const login = async (username, password) => {
  const response = await api.post("login/", { username, password });
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
  return response.data.user;
};

// REGISTER
export const register = async (userData) => {
  const response = await api.post("register/", userData);
  return response.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const response = await api.get("me/");
  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ROOMS
export const getRooms = () => api.get("rooms/");

// RESERVATIONS
export const getReservations = () => api.get("reservations/");
export const createReservation = (data) => api.post("reservations/", data);

// NOTIFICATIONS
export const getNotifications = () => api.get("notifications/");

// USERS
export const getUsers = () => api.get("users/");

export default api;
