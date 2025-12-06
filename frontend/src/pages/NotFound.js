import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center">
      <Card className="border-0 shadow" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card.Body className="py-5">
          <h1 className="display-1 text-muted">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Return to Home
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NotFound;