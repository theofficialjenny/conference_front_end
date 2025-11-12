import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>

      <nav className="admin-nav">
        <div className="nav-links">
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
          <button onClick={() => navigate("/admin/rooms")}>Manage Rooms</button>
          <button onClick={() => navigate("/admin/reservations")}>Manage Reservations</button>
        </div>

        <div className="nav-actions">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/")}>Return to Site</button>
        </div>
      </nav>

      <main className="admin-main">
        <div className="container">{children}</div>
      </main>

      <footer className="admin-footer">
        &copy; {new Date().getFullYear()} Conference Room Management System
      </footer>
    </div>
  );
}

export default AdminLayout;
