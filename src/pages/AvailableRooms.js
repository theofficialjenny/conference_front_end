import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://conference-room-six.vercel.app/api/';

  useEffect(() => {
    const getRooms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}rooms/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to fetch rooms.');
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [token]);

  const reserve = (roomId) => {
    navigate(`/reserve/${roomId}`);
  };

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Available Rooms</h2>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.id} style={{ marginBottom: '15px' }}>
              <strong>{room.name}</strong><br />
              Capacity: {room.capacity}<br />
              {room.location && <>Location: {room.location}<br /></>}
              {room.description && <>Description: {room.description}<br /></>}
              <button onClick={() => reserve(room.id)} style={{ marginTop: '10px' }}>
                Reserve this room
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available at the moment.</p>
      )}
    </div>
  );
}

export default AvailableRooms;


