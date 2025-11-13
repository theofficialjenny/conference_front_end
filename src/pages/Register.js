import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://conference-room-six.vercel.app/api/';

  const submit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}users/`,
        { username, password, password2 },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (onRegister) onRegister(res.data);
      alert("Account created successfully!");
      navigate('/login');
    } catch (err) {
      console.error(err.response || err);
      setError("Registration failed. Try a different username.");
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '60px auto',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '30px'
    }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '25px' }}>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <button style={{
          background:'#007bff',
          color:'white',
          padding:'10px',
          border:'none',
          borderRadius:'6px',
          cursor:'pointer',
          fontSize:'16px'
        }} type="submit">
          Register
        </button>
      </form>
      <p style={{ textAlign:'center', marginTop:'20px', color:'#555' }}>
        Already have an account? <a href="/login" style={{ color:'#007bff', textDecoration:'none' }}>Login Here</a>
      </p>
    </div>
  );
}

export default Register;

