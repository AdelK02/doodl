import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const [localUser, setLocalUser] = useState(() => {
    const storedUsername = localStorage.getItem("username");
    return storedUsername ? { username: storedUsername } : null;
  });

  useEffect(() => {
    if (user) {
      setLocalUser(user); // Sync state with App.jsx
    }
    console.log("Header re-rendered, received user:", user);
  }, [user]);

  console.log("Header received user:", user);

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call logout function from App.jsx
    setLocalUser(null); // Clear local state
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar fixed='top' className="bg-light">
      <Container fluid className="d-flex justify-content-between">
        {/* Logo & Title */}
        <Navbar.Brand>
          <Link to="/" className='text-white d-flex mt-2 ps-2' style={{ textDecoration: 'none', fontSize: '28px', justifyContent: 'space-evenly' }}>
            <img src="src/assets/pencil.png" alt="Logo" style={{ width: "60px" }} />
            <h1 className='text-dark fs-3 ms-1'>Doodl</h1>
          </Link>
        </Navbar.Brand>

        {/* User Info / Logout */}
        {localUser ? (
          <div className="d-flex align-items-center">
            <p className="me-3 text-dark fw-bold">Hi, {localUser.username}!</p>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
