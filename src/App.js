import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AvailableRooms from './pages/AvailableRooms';
import ReserveRoom from './pages/ReserveRoom';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import ManageRooms from './pages/ManageRooms';
import ManageReservations from './pages/ManageReservations';

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://conference-room-six.vercel.app/api/';

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
    setNotifications([]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      axios
        .get(`${API_BASE_URL}me/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error('User fetch failed:', err.response?.status, err.response?.data);
          setUser(null);
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (user && token) {
      axios
        .get(`${API_BASE_URL}notifications/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNotifications(res.data))
        .catch((err) => {
          console.error('Failed to fetch notifications:', err.response?.status, err.response?.data);
          setNotifications([]);
        });
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home user={user} notifications={notifications} onLogout={handleLogout} />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<AvailableRooms />} />
        <Route path="/reserve/:roomId" element={<ReserveRoom />} />
        <Route path="/my-reservations" element={<MyReservations />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard user={user} onLogout={handleLogout} />}
        />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/rooms" element={<ManageRooms />} />
        <Route path="/admin/reservations" element={<ManageReservations />} />
      </Routes>
    </Router>
  );
}

export default App;

