import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';
axios.defaults.withCredentials = true;

export const getRooms = () => axios.get(`${API_BASE_URL}rooms/`);
export const getReservations = () => axios.get(`${API_BASE_URL}reservations/`);
export const getNotifications = () => axios.get(`${API_BASE_URL}notifications/`);
export const getUsers = () => axios.get(`${API_BASE_URL}users/`);

// Example POST request
export const createReservation = (data) => axios.post(`${API_BASE_URL}reservations/`, data);
