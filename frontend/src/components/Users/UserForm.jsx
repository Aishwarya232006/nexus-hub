import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'; // Fixed import
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import userService from '../../services/userService';

const userSchema = yup.object().shape({
  freelancerId: yup.string().required('Freelancer ID is required'),
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  experienceLevel: yup
    .string()
    .oneOf(['Beginner', 'Intermediate', 'Expert', 'Entry', 'Mid', 'Senior'])
    .required('Experience level is required'),
  hourlyRate: yup
    .number()
    .positive('Hourly rate must be positive')
    .required('Hourly rate is required'),
  region: yup.string().required('Region is required'),
  platform: yup.string().required('Platform is required'),
  earningsUSD: yup.number().positive('Earnings must be positive').optional(),
  jobSuccessRate: yup
    .number()
    .min(0, 'Success rate must be at least 0')
    .max(100, 'Success rate cannot exceed 100')
    .optional(),
});

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialValues, setInitialValues] = useState({
    freelancerId: '',
    name: '',
    email: '',
    experienceLevel: 'Beginner',
    hourlyRate: '',
    region: '',
    platform: '',
    earningsUSD: '',
    jobSuccessRate: '',
    skills: '',
    clientRating: '',
    jobsCompleted: '',
    paymentMethod: '',
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      const user = response.data;
      
      setInitialValues({
        freelancerId: user.freelancerId || '',
        name: user.name || '',
        email: user.email || '',
        experienceLevel: user.experienceLevel || 'Beginner',
        hourlyRate: user.hourlyRate || '',
        region: user.region || '',
        platform: user.platform || '',
        earningsUSD: user.earningsUSD || '',
        jobSuccessRate: user.jobSuccessRate || '',
        skills: user.skills ? user.skills.join(', ') : '',
        clientRating: user.clientRating || '',
        jobsCompleted: user.jobsCompleted || '',
        paymentMethod: user.paymentMethod || '',
      });
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');
      
      // Prepare data for API
      const userData = {
        ...values,
        hourlyRate: parseFloat(values.hourlyRate),
        earningsUSD: values.earningsUSD ? parseFloat(values.earningsUSD) : undefined,
        jobSuccessRate: values.jobSuccessRate ? parseFloat(values.jobSuccessRate) : undefined,
        skills: values.skills ? values.skills.split(',').map(skill => skill.trim()) : [],
        clientRating: values.clientRating ? parseFloat(values.clientRating) : undefined,
        jobsCompleted: values.jobsCompleted ? parseInt(values.jobsCompleted) : undefined,
      };

      if (isEditMode) {
        await userService.updateUser(id, userData);
        setSuccess('User updated successfully!');
      } else {
        await userService.createUser(userData);
        setSuccess('User created successfully!');
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/users');
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
      <h2 className="mb-4">{isEditMode ? 'Edit User' : 'Create New User'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
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
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.name && errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
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
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
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

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Region *</Form.Label>
                  <Form.Control
                    type="text"
                    name="region"
                    value={values.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.region && errors.region}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.region}
                  </Form.Control.Feedback>
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
                    value={values.platform}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.platform && errors.platform}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.platform}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Earnings USD</Form.Label>
                  <Form.Control
                    type="number"
                    name="earningsUSD"
                    value={values.earningsUSD}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Skills (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    value={values.skills}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="JavaScript, React, Node.js"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Job Success Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="jobSuccessRate"
                    value={values.jobSuccessRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    max="100"
                  />
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
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/users')}
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

export default UserForm;