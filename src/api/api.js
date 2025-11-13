import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access"); // <- changed key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  const response = await api.post("login/", { username, password });

  localStorage.setItem("access", response.data.access);   // <- changed key
  localStorage.setItem("refresh", response.data.refresh); // <- changed key

  return response.data.user;
};

export const register = async (userData) => {
  const response = await api.post("register/", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("me/");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const getRooms = () => api.get("rooms/");
export const getReservations = () => api.get("reservations/");
export const createReservation = (data) => api.post("reservations/", data);
export const getNotifications = () => api.get("notifications/");
export const getUsers = () => api.get("users/");
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh"); // <- changed key
  if (!refresh) return null;

  try {
    const response = await api.post("token/refresh/", { refresh });
    localStorage.setItem("access", response.data.access); // <- changed key
    return response.data.access;
  } catch (err) {
    logout();
    return null;
  }
};

export default api;