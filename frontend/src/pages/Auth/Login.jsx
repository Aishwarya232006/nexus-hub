import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import api from '../../services/api';

const Login = () => {
  const [step, setStep] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Frontend Login: Attempting login with email:', formData.email);
      console.log('Frontend Login: Password length:', formData.password.length);
      
      const response = await api.post('/users/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      console.log('Frontend Login: Response received:', response.data);

      if (response.data.success) {
        setSuccess('OTP sent to your email!');
        setStep('otp');
      } else {
        setError(response.data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Frontend Login: Error details:', err);
      console.error('Frontend Login: Error response:', err.response?.data);
      console.error('Frontend Login: Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Frontend OTP: Verifying OTP for:', formData.email);
      console.log('Frontend OTP: OTP provided:', formData.otp);
      
      const response = await api.post('/users/verify-otp', {
        email: formData.email.trim(),
        otp: formData.otp
      });

      console.log('Frontend OTP: Response received:', response.data);

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        navigate('/');
      } else {
        setError(response.data.error || 'OTP verification failed.');
      }
    } catch (err) {
      console.error('Frontend OTP: Error details:', err);
      console.error('Frontend OTP: Error response:', err.response?.data);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'login') {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '400px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
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
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Login'}
              </Button>
            </Form>
            
            <div className="text-center mt-3">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Verify OTP</h2>
          <p className="text-center">Enter the 6-digit OTP sent to {formData.email}</p>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleVerifyOTP}>
            <Form.Group className="mb-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </Form.Group>
            
            <Button 
              variant="success" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Form>
          
          <Button 
            variant="outline-secondary" 
            className="w-100 mt-2"
            onClick={() => setStep('login')}
          >
            Back to Login
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;