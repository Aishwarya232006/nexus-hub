import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="text-center">
        <Card.Body>
          <h1 className="text-danger">403</h1>
          <h3>Access Denied</h3>
          <p className="text-muted">
            You don't have permission to access this page.
          </p>
          <div className="mt-3">
            <Button as={Link} to="/" variant="primary" className="me-2">
              Go Home
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary">
              Login
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Unauthorized;