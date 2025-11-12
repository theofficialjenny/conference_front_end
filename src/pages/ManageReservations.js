import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access');
  const headers = { Authorization: `Bearer ${token}` };

  const getReservations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/reservations/', { headers });
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  const getRooms = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/rooms/', { headers });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRooms();
    getReservations();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reservations/${id}/`, { headers });
      setReservations(reservations.filter(r => r.id !== id));
    } catch {
      alert('Error canceling reservation.');
    }
  };

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: '15px' }}>Manage Reservations</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {reservations.map(res => (
            <div key={res.id} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              <h3>{res.room.name}</h3>
              <p><strong>User:</strong> {res.user.username}</p>
              <p><strong>Date:</strong> {res.date}</p>
              <p><strong>Time:</strong> {res.start_time} - {res.end_time}</p>
              <button onClick={() => cancel(res.id)} style={{ background: '#dc3545', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No reservations found.</p>
      )}
    </AdminLayout>
  );
}

export default ManageReservations;


