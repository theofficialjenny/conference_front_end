import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ReserveRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('access');

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const getRoom = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoom(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to load room.');
      }
    };

    getRoom();
  }, [roomId, token, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      setError('Please fill all fields.');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/reservations/',
        {
          room: parseInt(roomId),
          date,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/my-reservations');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.non_field_errors?.[0] || 'Failed to reserve room.');
    }
  };

  if (!room) return <p>Loading room...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h2>Reserve Room: {room.name}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Date (YYYY-MM-DD):</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time (HH:MM, 24-hour):</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time (HH:MM, 24-hour):</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            background: '#007bff',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reserve
        </button>
      </form>
    </div>
  );
}

export default ReserveRoom;










