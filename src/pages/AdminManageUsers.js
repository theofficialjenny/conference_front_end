import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://conference-room-six.vercel.app/api/';

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false,
  });

  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false,
  });

  const token = localStorage.getItem('access');

  const headers = { Authorization: `Bearer ${token}` };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}users/`, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}users/`, newUser, { headers });
      setNewUser({ username: '', email: '', password: '', is_staff: false });
      getUsers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to add user.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE_URL}users/${id}/`, { headers });
      setUsers(users.filter(user => user.id !== id));
    } catch {
      alert('Error deleting user.');
    }
  };

  const startEdit = (user) => {
    setEditUserId(user.id);
    setEditUserData({
      username: user.username,
      email: user.email || '',
      password: '',
      is_staff: user.is_staff,
    });
  };

  const editUser = async (e) => {
    e.preventDefault();
    try {
      const data = { ...editUserData };
      if (!data.password) delete data.password;
      await axios.put(`${API_BASE_URL}users/${editUserId}/`, data, { headers });
      setEditUserId(null);
      getUsers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to edit user.');
    }
  };

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: '15px' }}>Manage Users</h2>

      {/* Add Form */}
      <form onSubmit={addUser} style={{ marginBottom: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={newUser.is_staff}
            onChange={(e) => setNewUser({ ...newUser, is_staff: e.target.checked })}
          /> Admin
        </label>
        <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>
          Add User
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {users.map(user => (
            <div key={user.id} style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
              {editUserId === user.id ? (
                <form onSubmit={editUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    value={editUserData.username}
                    onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="New Password (leave blank to keep)"
                    value={editUserData.password}
                    onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={editUserData.is_staff}
                      onChange={(e) => setEditUserData({ ...editUserData, is_staff: e.target.checked })}
                    /> Admin
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', padding: '6px', borderRadius: '6px', border: 'none' }}>Save</button>
                    <button type="button" onClick={() => setEditUserId(null)} style={{ flex: 1, background: '#6c757d', color: 'white', padding: '6px', borderRadius: '6px', border: 'none' }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{user.username}</h3>
                  <p><strong>Email:</strong> {user.email || '—'}</p>
                  <p><strong>Role:</strong> {user.is_staff ? 'Admin' : 'User'}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(user)} style={{ flex: 1, background: '#ffc107', color: 'black', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteUser(user.id)} style={{ flex: 1, background: '#dc3545', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: '20px' }}>No users found.</p>
      )}
    </AdminLayout>
  );
}

export default AdminManageUsers;




