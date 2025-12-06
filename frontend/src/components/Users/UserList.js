import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        sortBy,
        page: currentPage,
        limit: 10,
      };
      
      const response = await userService.getUsers(params);
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      
      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="hourlyRate">Sort by Hourly Rate</option>
            <option value="experienceLevel">Sort by Experience</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button as={Link} to="/users/create" variant="primary">
            + Add New User
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Hourly Rate</th>
            <th>Region</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.experienceLevel}</td>
                <td>${user.hourlyRate}</td>
                <td>{user.region}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/users/${user._id}`}
                    variant="info"
                    size="sm"
                    className="me-2"
                  >
                    View
                  </Button>
                  <Button
                    as={Link}
                    to={`/users/edit/${user._id}`}
                    variant="warning"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="me-2"
        >
          Previous
        </Button>
        <span className="mx-3 align-self-center">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserList;