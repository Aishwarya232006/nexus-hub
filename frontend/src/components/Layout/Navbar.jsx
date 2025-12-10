import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const NavigationBar = () => {
  // ===== NEW: Authentication variables =====
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  // ===== NEW: Logout handler =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
           Nexus Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/users">Users</Nav.Link>
            <Nav.Link as={Link} to="/listings">Listings</Nav.Link>
            
            {/* ===== CHANGED: Only show create links when logged in ===== */}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/users/create">Create User</Nav.Link>
                <Nav.Link as={Link} to="/listings/create">Create Listing</Nav.Link>
              </>
            )}
          </Nav>
          
          {/* ===== NEW: Authentication buttons on right side ===== */}
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 text-white">
                  Welcome, {user.name} ({user.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login" className="me-2">
                  Login
                </Button>
                <Button variant="light" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;