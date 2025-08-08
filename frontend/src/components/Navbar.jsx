import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Farm-Products</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/upload">Upload</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

