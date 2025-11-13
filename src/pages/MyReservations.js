import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', start_time: '', end_time: '' });
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://conference-room-six.vercel.app/api/';

  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const allReservations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}reservations/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to fetch reservations.');
      } finally {
        setLoading(false);
      }
    };

    allReservations();
  }, [token]);

  const cancelRes = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await axios.delete(`${API_BASE_URL}reservations/${reservationId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(reservations.filter((r) => r.id !== reservationId));
    } catch {
      alert('Error cancelling reservation.');
    }
  };

  const editClick = (reservation) => {
    setEditingId(reservation.id);
    setFormData({
      date: reservation.date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
    });
  };

  const editCancel = () => {
    setEditingId(null);
    setFormData({ date: '', start_time: '', end_time: '' });
  };

  const saveEdit = async (reservationId) => {
    try {
      const updated = {
        ...formData,
        room: reservations.find((r) => r.id === reservationId).room.id,
      };

      await axios.put(
        `${API_BASE_URL}reservations/${reservationId}/`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReservations(
        reservations.map((r) => (r.id === reservationId ? { ...r, ...updated } : r))
      );

      setEditingId(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to update reservation.');
    }
  };

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Reservations</h2>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id} style={{ marginBottom: '20px' }}>
              <strong>{reservation.room.name}</strong><br />

              {editingId === reservation.id ? (
                <>
                  <label>
                    Date:{' '}
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </label>
                  <br />
                  <label>
                    Start:{' '}
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        setFormData({ ...formData, start_time: e.target.value })
                      }
                    />
                  </label>
                  <br />
                  <label>
                    End:{' '}
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) =>
                        setFormData({ ...formData, end_time: e.target.value })
                      }
                    />
                  </label>
                  <br />
                  <button
                    onClick={() => saveEdit(reservation.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Save
                  </button>
                  <button onClick={editCancel}>Cancel</button>
                </>
              ) : (
                <>
                  Date: {reservation.date}<br />
                  Time: {reservation.start_time} - {reservation.end_time}<br />
                  <button
                    onClick={() => editClick(reservation)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button onClick={() => cancelRes(reservation.id)}>Cancel</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no reservations yet.</p>
      )}
    </div>
  );
}

export default MyReservations;

