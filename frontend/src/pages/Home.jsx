import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import listingService from '../services/listingService';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    loading: true,
    error: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch users and listings in parallel
      const [usersResponse, listingsResponse] = await Promise.all([
        userService.getUsers({ limit: 1 }),
        listingService.getListings({ limit: 1 })
      ]);

      setStats({
        totalUsers: usersResponse.pagination.totalUsers,
        totalListings: listingsResponse.pagination.totalListings,
        loading: false,
        error: ''
      });
    } catch (err) {
      setStats(prev => ({
        ...prev,
        error: 'Failed to fetch data',
        loading: false
      }));
    }
  };

  if (stats.loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to Nexus Hub</h1>
        <p className="lead">Freelancer Earnings Tracking & Management System</p>
      </div>

      {stats.error && <Alert variant="danger">{stats.error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>👥 Total Users</Card.Title>
              <Card.Text className="display-6">{stats.totalUsers}</Card.Text>
              <Button as={Link} to="/users" variant="primary">
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>Total Listings</Card.Title>
              <Card.Text className="display-6">{stats.totalListings}</Card.Text>
              <Button as={Link} to="/listings" variant="primary">
                Manage Listings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Create New User</Card.Title>
              <Card.Text>
                Add a new freelancer to the system with their details and earnings information.
              </Card.Text>
              <Button as={Link} to="/users/create" variant="success" className="w-100">
                + Add User
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Create New Listing</Card.Title>
              <Card.Text>
                Add a new job listing with project details, earnings, and client information.
              </Card.Text>
              <Button as={Link} to="/listings/create" variant="success" className="w-100">
                + Add Listing
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>View Analytics</Card.Title>
              <Card.Text>
                View statistics and analytics about freelancer earnings and job performance.
              </Card.Text>
              <Button variant="info" className="w-100" disabled>
                Coming Soon
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* API Status */}
      <div className="mt-5">
        <Card>
          <Card.Body>
            <Card.Title> System Status</Card.Title>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Backend API:</strong>{' '}
                  <span className="text-success">● Connected</span>
                </p>
                <p>
                  <strong>Database:</strong>{' '}
                  <span className="text-success">● MongoDB Atlas Connected</span>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Frontend:</strong>{' '}
                  <span className="text-success">● React App Running</span>
                </p>
                <p>
                  <strong>Environment:</strong> Development
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Home;