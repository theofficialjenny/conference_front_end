import React from "react";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard({ user, onLogout }) {
    console.log("AdminDashboard user:", user);
  return (
    <AdminLayout onLogout={onLogout}>
      <h2>Welcome, {user?.username || "Admin"}</h2>
      <p>Use the navigation above to manage rooms, users, and reservations.</p>
    </AdminLayout>
  );
}

export default AdminDashboard;
