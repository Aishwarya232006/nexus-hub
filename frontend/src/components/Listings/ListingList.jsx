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
      setError('Failed to fetch listing details');
      console.error(err);
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

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!listing) return <Alert variant="warning">Listing not found</Alert>;

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
          <Card className="mb-4">
            <Card.Header>
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
                </Col>
                <Col md={6}>
                  <p><strong>Client Region:</strong> {listing.clientRegion}</p>
                  <p><strong>Payment Method:</strong> {listing.paymentMethod}</p>
                  <p><strong>Project Type:</strong> {listing.projectType || 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Financial Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Earnings:</strong> ${listing.earningsUSD}</p>
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
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Client Rating:</strong> {listing.clientRating ? `${listing.clientRating}/5` : 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Job Duration:</strong> {listing.jobDurationDays || 0} days
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {new Date(listing.createdAt).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(listing.updatedAt).toLocaleDateString()}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <Button as={Link} to="/listings" variant="secondary">
          ← Back to Listings
        </Button>
      </div>
    </div>
  );
};

export default ListingDetail;