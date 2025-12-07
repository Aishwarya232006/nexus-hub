import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import listingService from '../../services/listingService';

const listingSchema = yup.object().shape({
  freelancerId: yup.string().required('Freelancer ID is required'),
  jobCategory: yup.string().required('Job category is required'),
  platform: yup.string().required('Platform is required'),
  experienceLevel: yup
    .string()
    .oneOf(['Beginner', 'Intermediate', 'Expert', 'Entry', 'Mid', 'Senior'])
    .required('Experience level is required'),
  clientRegion: yup.string().required('Client region is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  earningsUSD: yup
    .number()
    .positive('Earnings must be positive')
    .required('Earnings USD is required'),
  hourlyRate: yup
    .number()
    .positive('Hourly rate must be positive')
    .required('Hourly rate is required'),
});

const ListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    platforms: [],
    experienceLevels: [],
    regions: []
  });

  const [initialValues, setInitialValues] = useState({
    freelancerId: '',
    jobCategory: '',
    platform: '',
    experienceLevel: 'Beginner',
    clientRegion: '',
    paymentMethod: '',
    earningsUSD: '',
    hourlyRate: '',
    jobsCompleted: '',
    jobSuccessRate: '',
    clientRating: '',
    jobDurationDays: '',
    projectType: '',
    rehireRate: '',
    marketingSpend: ''
  });

  const isEditMode = !!id;

  useEffect(() => {
    fetchFilterOptions();
    if (isEditMode) {
      fetchListing();
    }
  }, [id]);

  const fetchFilterOptions = async () => {
    try {
      const response = await listingService.getFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingService.getListingById(id);
      const listing = response.data;
      
      setInitialValues({
        freelancerId: listing.freelancerId || '',
        jobCategory: listing.jobCategory || '',
        platform: listing.platform || '',
        experienceLevel: listing.experienceLevel || 'Beginner',
        clientRegion: listing.clientRegion || '',
        paymentMethod: listing.paymentMethod || '',
        earningsUSD: listing.earningsUSD || '',
        hourlyRate: listing.hourlyRate || '',
        jobsCompleted: listing.jobsCompleted || '',
        jobSuccessRate: listing.jobSuccessRate || '',
        clientRating: listing.clientRating || '',
        jobDurationDays: listing.jobDurationDays || '',
        projectType: listing.projectType || '',
        rehireRate: listing.rehireRate || '',
        marketingSpend: listing.marketingSpend || ''
      });
    } catch (err) {
      setError('Failed to load listing data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      // Prepare data for API
      const listingData = {
        ...values,
        earningsUSD: parseFloat(values.earningsUSD),
        hourlyRate: parseFloat(values.hourlyRate),
        jobsCompleted: values.jobsCompleted ? parseInt(values.jobsCompleted) : undefined,
        jobSuccessRate: values.jobSuccessRate ? parseFloat(values.jobSuccessRate) : undefined,
        clientRating: values.clientRating ? parseFloat(values.clientRating) : undefined,
        jobDurationDays: values.jobDurationDays ? parseInt(values.jobDurationDays) : undefined,
        rehireRate: values.rehireRate ? parseFloat(values.rehireRate) : undefined,
        marketingSpend: values.marketingSpend ? parseFloat(values.marketingSpend) : undefined,
      };

      if (isEditMode) {
        await listingService.updateListing(id, listingData);
        setSuccess('Listing updated successfully!');
      } else {
        await listingService.createListing(listingData);
        setSuccess('Listing created successfully!');
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/listings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h2 className="mb-4">{isEditMode ? 'Edit Listing' : 'Create New Listing'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={listingSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Freelancer ID *</Form.Label>
                  <Form.Control
                    type="text"
                    name="freelancerId"
                    value={values.freelancerId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.freelancerId && errors.freelancerId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.freelancerId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Category *</Form.Label>
                  <Form.Select
                    name="jobCategory"
                    value={values.jobCategory}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.jobCategory && errors.jobCategory}
                  >
                    <option value="">Select Category</option>
                    {filterOptions.categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.jobCategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Platform *</Form.Label>
                  <Form.Select
                    name="platform"
                    value={values.platform}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.platform && errors.platform}
                  >
                    <option value="">Select Platform</option>
                    {filterOptions.platforms.map((platform, index) => (
                      <option key={index} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.platform}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience Level *</Form.Label>
                  <Form.Select
                    name="experienceLevel"
                    value={values.experienceLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.experienceLevel && errors.experienceLevel}
                  >
                    {filterOptions.experienceLevels.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.experienceLevel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client Region *</Form.Label>
                  <Form.Select
                    name="clientRegion"
                    value={values.clientRegion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.clientRegion && errors.clientRegion}
                  >
                    <option value="">Select Region</option>
                    {filterOptions.regions.map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.clientRegion}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method *</Form.Label>
                  <Form.Control
                    type="text"
                    name="paymentMethod"
                    value={values.paymentMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.paymentMethod && errors.paymentMethod}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.paymentMethod}
                  </Form.Control.Feedback>
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
                    value={values.earningsUSD}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.earningsUSD && errors.earningsUSD}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.earningsUSD}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="hourlyRate"
                    value={values.hourlyRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.hourlyRate && errors.hourlyRate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hourlyRate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="me-2"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Listing' : 'Create Listing'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/listings')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ListingForm;