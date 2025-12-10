import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    freelancerId: '',
    name: '',
    email: '',
    password: '',
    experienceLevel: 'Intermediate',
    hourlyRate: '',
    region: '',
    platform: 'Upwork',
    skills: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        hourlyRate: parseFloat(formData.hourlyRate) || 0
      };

      const response = await api.post('/users/register', dataToSend);

      if (response.data.success) {
        setSuccess('Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Freelancer ID *</Form.Label>
              <Form.Control
                type="text"
                name="freelancerId"
                value={formData.freelancerId}
                onChange={handleChange}
                required
                placeholder="Enter unique freelancer ID"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Hourly Rate (USD) *</Form.Label>
              <Form.Control
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 50.00"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Region *</Form.Label>
              <Form.Control
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                placeholder="e.g., North America"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Platform *</Form.Label>
              <Form.Select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Toptal">Toptal</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;