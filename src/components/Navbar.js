import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Navigate to the sign-in page after logout
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        MERN-Shop
      </Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        {token ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/signin">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
