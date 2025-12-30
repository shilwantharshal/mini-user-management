import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hide navbar when user is not logged in
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* App Title */}
      <strong>Mini User Management</strong>

      {/* User Info & Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span>
          👤 {user.full_name} ({user.role})
        </span>

        <Link to="/profile">Profile</Link>

        {user.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "6px 12px",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Logout
      </button>
    </nav>
  );
}
