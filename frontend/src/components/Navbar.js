import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <h3 style={{ color: "white" }}>Monk</h3>
        </Link>
      </div>
      <div className="navbar-categories">
        <Link to="/posts/Music">Music</Link>
        <Link to="/posts/Travel">Travel</Link>
        <Link to="/posts/Photography">Photography</Link>
        <Link to="/posts/Another">Another</Link>
      </div>
      <div className="navbar-auth">
        {username ? (
          <>
            <span>{username}</span>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
