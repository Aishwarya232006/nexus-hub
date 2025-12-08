import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Badge, ListGroup, Row, Col } from 'react-bootstrap';
import listingService from '../../services/listingService';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingService.getListingById(id);
      setListing(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching listing:', err);
      if (err.response?.status === 404) {
        setError('Listing not found. It may have been deleted or does not exist.');
      } else {
        setError('Failed to fetch listing details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingService.deleteListing(id);
        navigate('/listings');
      } catch (err) {
        setError('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading listing details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-5">
        <Alert variant="warning">
          <Alert.Heading>Listing Not Found</Alert.Heading>
          <p>{error || 'The listing you are looking for does not exist.'}</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button as={Link} to="/listings" variant="primary" className="me-2">
              Back to Listings
            </Button>
            <Button as={Link} to="/listings/create" variant="success">
              Create New Listing
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listing Details</h2>
        <div>
          <Button as={Link} to={`/listings/edit/${id}`} variant="warning" className="me-2">
            Edit Listing
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Listing
          </Button>
        </div>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Job Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Job Category:</strong> {listing.jobCategory}</p>
                  <p><strong>Platform:</strong> {listing.platform}</p>
                  <p>
                    <strong>Experience Level:</strong>{' '}
                    <Badge bg={
                      listing.experienceLevel === 'Beginner' ? 'info' :
                      listing.experienceLevel === 'Intermediate' ? 'warning' : 'success'
                    }>
                      {listing.experienceLevel}
                    </Badge>
                  </p>
                  <p><strong>Freelancer ID:</strong> {listing.freelancerId}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Client Region:</strong> {listing.clientRegion}</p>
                  <p><strong>Payment Method:</strong> {listing.paymentMethod}</p>
                  <p><strong>Project Type:</strong> {listing.projectType || 'N/A'}</p>
                  <p><strong>Job Duration:</strong> {listing.jobDurationDays || 0} days</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Financial Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Total Earnings:</strong> ${listing.earningsUSD}</p>
                  <p><strong>Hourly Rate:</strong> ${listing.hourlyRate}/hr</p>
                  <p><strong>Marketing Spend:</strong> ${listing.marketingSpend || 0}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Jobs Completed:</strong> {listing.jobsCompleted || 0}</p>
                  <p><strong>Job Success Rate:</strong> {listing.jobSuccessRate || 0}%</p>
                  <p><strong>Rehire Rate:</strong> {listing.rehireRate || 0}%</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Client Rating:</strong>
                  <Badge bg={
                    listing.clientRating >= 4.5 ? 'success' :
                    listing.clientRating >= 4.0 ? 'warning' : 'danger'
                  }>
                    {listing.clientRating ? `${listing.clientRating}/5` : 'N/A'}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Job Success:</strong>
                  <Badge bg={
                    listing.jobSuccessRate >= 90 ? 'success' :
                    listing.jobSuccessRate >= 70 ? 'warning' : 'danger'
                  }>
                    {listing.jobSuccessRate || 0}%
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <strong>Rehire Rate:</strong>
                  <Badge bg={
                    listing.rehireRate >= 80 ? 'success' :
                    listing.rehireRate >= 60 ? 'warning' : 'danger'
                  }>
                    {listing.rehireRate || 0}%
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Timestamps</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {new Date(listing.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(listing.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Database ID:</strong>
                  <small className="d-block text-muted mt-1">{listing._id}</small>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <Button as={Link} to="/listings" variant="secondary" className="me-2">
          ← Back to Listings
        </Button>
        <Button as={Link} to={`/listings/edit/${id}`} variant="primary" className="me-2">
          Edit This Listing
        </Button>
        <Button variant="outline-danger" onClick={handleDelete}>
          Delete Listing
        </Button>
      </div>
    </div>
  );
};

export default ListingDetail;