import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function Layout({ user, children, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      {/* Header */}
      <header className="admin-header">
        <h1>Te Whare Rūnanga Conference Room Reservation System</h1>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-links">
          {user ? (
            <>
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/rooms")}>Available Rooms</button>
              <button onClick={() => navigate("/my-reservations")}>My Reservations</button>
              {user.is_staff && (
                <button onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>

        {user && (
          <div className="nav-actions">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="admin-main">
        <div className="container">{children}</div>
      </main>

      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} Conference Room Management System
      </footer>
    </div>
  );
}

export default Layout;





