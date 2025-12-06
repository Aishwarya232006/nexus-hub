import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Badge, ListGroup, Row, Col } from 'react-bootstrap';
import userService from '../services/userService';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        navigate('/users');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <Alert variant="warning">User not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Details</h2>
        <div>
          <Button as={Link} to={`/users/edit/${id}`} variant="warning" className="me-2">
            Edit User
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete User
          </Button>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Basic Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p>
                    <strong>Experience Level:</strong>{' '}
                    <Badge bg={
                      user.experienceLevel === 'Beginner' ? 'info' :
                      user.experienceLevel === 'Intermediate' ? 'warning' : 'success'
                    }>
                      {user.experienceLevel}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p><strong>Freelancer ID:</strong> {user.freelancerId}</p>
                  <p><strong>Region:</strong> {user.region}</p>
                  <p><strong>Platform:</strong> {user.platform}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Earnings & Performance</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Hourly Rate:</strong> ${user.hourlyRate}</p>
                  <p><strong>Total Earnings:</strong> ${user.earningsUSD || 0}</p>
                  <p><strong>Jobs Completed:</strong> {user.jobsCompleted || 0}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Job Success Rate:</strong> {user.jobSuccessRate || 0}%</p>
                  <p><strong>Client Rating:</strong> {user.clientRating ? `${user.clientRating}/5` : 'N/A'}</p>
                  <p><strong>Rehire Rate:</strong> {user.rehireRate || 0}%</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Skills</h5>
            </Card.Header>
            <Card.Body>
              {user.skills && user.skills.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} bg="secondary" className="p-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No skills listed</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Additional Information</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Payment Method:</strong> {user.paymentMethod || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Project Type:</strong> {user.projectType || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(user.updatedAt).toLocaleDateString()}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <Button as={Link} to="/users" variant="secondary">
          ← Back to Users
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;