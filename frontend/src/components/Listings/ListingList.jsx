import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import listingService from '../../services/listingService';

const ListingList = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingService.getListings();
      setListings(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please check if backend is running.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button onClick={fetchListings} variant="outline-danger">
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listings</h2>
        <Button as={Link} to="/listings/create" variant="success">
          + Add New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Listings Found</Card.Title>
            <Card.Text>
              You haven't created any listings yet. Start by adding your first listing!
            </Card.Text>
            <Button as={Link} to="/listings/create" variant="primary" size="lg">
              Create Your First Listing
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search listings by job category or platform..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Job Category</th>
                <th>Platform</th>
                <th>Experience</th>
                <th>Earnings</th>
                <th>Hourly Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td>{listing.jobCategory}</td>
                  <td>{listing.platform}</td>
                  <td>
                    <span className={`badge bg-${
                      listing.experienceLevel === 'Beginner' ? 'info' :
                      listing.experienceLevel === 'Intermediate' ? 'warning' : 'success'
                    }`}>
                      {listing.experienceLevel}
                    </span>
                  </td>
                  <td>${listing.earningsUSD}</td>
                  <td>${listing.hourlyRate}/hr</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/listings/${listing._id}`}
                      variant="info"
                      size="sm"
                      className="me-2"
                    >
                      View
                    </Button>
                    <Button
                      as={Link}
                      to={`/listings/edit/${listing._id}`}
                      variant="warning"
                      size="sm"
                      className="me-2"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ListingList;