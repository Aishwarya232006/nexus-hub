import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import listingService from '../../services/listingService';

const ListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    freelancerId: '',
    jobCategory: '',
    platform: '',
    experienceLevel: 'Beginner',
    clientRegion: '',
    paymentMethod: '',
    earningsUSD: '',
    hourlyRate: ''
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingService.getListingById(id);
      const listing = response.data;
      
      setFormData({
        freelancerId: listing.freelancerId || '',
        jobCategory: listing.jobCategory || '',
        platform: listing.platform || '',
        experienceLevel: listing.experienceLevel || 'Beginner',
        clientRegion: listing.clientRegion || '',
        paymentMethod: listing.paymentMethod || '',
        earningsUSD: listing.earningsUSD || '',
        hourlyRate: listing.hourlyRate || ''
      });
    } catch (err) {
      setError('Failed to load listing data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const listingData = {
        ...formData,
        earningsUSD: parseFloat(formData.earningsUSD),
        hourlyRate: parseFloat(formData.hourlyRate)
      };

      if (isEditMode) {
        await listingService.updateListing(id, listingData);
        setSuccess('Listing updated successfully!');
      } else {
        await listingService.createListing(listingData);
        setSuccess('Listing created successfully!');
      }

      setTimeout(() => {
        navigate('/listings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h2 className="mb-4">{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Freelancer ID *</Form.Label>
              <Form.Control
                type="text"
                name="freelancerId"
                value={formData.freelancerId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Job Category *</Form.Label>
              <Form.Control
                type="text"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Platform *</Form.Label>
              <Form.Control
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Experience Level *</Form.Label>
              <Form.Select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Client Region *</Form.Label>
              <Form.Control
                type="text"
                name="clientRegion"
                value={formData.clientRegion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method *</Form.Label>
              <Form.Control
                type="text"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Earnings USD *</Form.Label>
              <Form.Control
                type="number"
                name="earningsUSD"
                value={formData.earningsUSD}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Hourly Rate ($) *</Form.Label>
              <Form.Control
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4">
          <Button
            type="submit"
            variant="primary"
            className="me-2"
          >
            {isEditMode ? 'Update Listing' : 'Create Listing'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/listings')}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ListingForm;