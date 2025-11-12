import React from 'react';
import Layout from '../components/Layout';

function Home({ user, notifications, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <div
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '30px',
        }}
      >
        <h2
          style={{
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Welcome to Te Whare Rūnanga Conference Room Reservation System
        </h2>

        {user ? (
          <>
            {/* Welcome message */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <p style={{ fontSize: '18px', color: '#34495e' }}>
                Hello, <strong>{user.username}</strong>
              </p>
              <p style={{ color: '#555' }}>
                Use the navigation menu to view available rooms or manage your reservations.
              </p>
            </div>

            <hr style={{ borderTop: '1px solid #eee', margin: '25px 0' }} />

            {/* Notifications section */}
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Notifications</h3>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '15px' }}>
              {notifications && notifications.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      style={{
                        background: '#fff',
                        marginBottom: '10px',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      {note.message} <br />
                      <small style={{ color: '#888' }}>
                        {new Date(note.created_at).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#777' }}>No new notifications</p>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#555' }}>
              Please{' '}
              <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                Login
              </a>{' '}
              or{' '}
              <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
                Register
              </a>{' '}
              to continue.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;



