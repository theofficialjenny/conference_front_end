import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: '',
    location: '',
    description: '',
  });

  const [editRoomId, setEditRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState({
    name: '',
    capacity: '',
    location: '',
    description: '',
  });

  const token = localStorage.getItem('access');
  const headers = { Authorization: `Bearer ${token}` };

  const getRooms = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/rooms/', { headers });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const addRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/rooms/', newRoom, { headers });
      setNewRoom({ name: '', capacity: '', location: '', description: '' });
      getRooms();
    } catch (err) {
      console.error(err);
      setError('Failed to add room.');
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/rooms/${id}/`, { headers });
      setRooms(rooms.filter(room => room.id !== id));
    } catch {
      alert('Error deleting room.');
    }
  };

  const startEdit = (room) => {
    setEditRoomId(room.id);
    setEditRoomData({ ...room });
  };

  const editRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/rooms/${editRoomId}/`, editRoomData, { headers });
      setEditRoomId(null);
      getRooms();
    } catch (err) {
      console.error(err);
      setError('Failed to edit room.');
    }
  };

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: '15px' }}>Manage Rooms</h2>

      {/* Add Form */}
      <form onSubmit={addRoom} style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newRoom.location}
          onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newRoom.description}
          onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
        />
        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Add Room</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {rooms.map(room => (
            <div key={room.id} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              {editRoomId === room.id ? (
                <form onSubmit={editRoom} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" value={editRoomData.name} onChange={(e) => setEditRoomData({ ...editRoomData, name: e.target.value })} required />
                  <input type="number" value={editRoomData.capacity} onChange={(e) => setEditRoomData({ ...editRoomData, capacity: e.target.value })} required />
                  <input type="text" value={editRoomData.location} onChange={(e) => setEditRoomData({ ...editRoomData, location: e.target.value })} />
                  <input type="text" value={editRoomData.description} onChange={(e) => setEditRoomData({ ...editRoomData, description: e.target.value })} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', padding: '6px', borderRadius: '6px', border: 'none' }}>Save</button>
                    <button type="button" onClick={() => setEditRoomId(null)} style={{ flex: 1, background: '#6c757d', color: 'white', padding: '6px', borderRadius: '6px', border: 'none' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{room.name}</h3>
                  <p><strong>Capacity:</strong> {room.capacity}</p>
                  <p><strong>Location:</strong> {room.location || '—'}</p>
                  <p><strong>Description:</strong> {room.description || '—'}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(room)} style={{ flex: 1, background: '#ffc107', color: 'black', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteRoom(room.id)} style={{ flex: 1, background: '#dc3545', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms found.</p>
      )}
    </AdminLayout>
  );
}

export default ManageRooms;


