import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import NavigationBar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import UsersPage from './pages/UsersPage';
import ListingsPage from './pages/ListingsPage';
import CreateUser from './pages/CreateUser';
import CreateListing from './pages/CreateListing';
import UserDetail from './pages/UserDetail';           // ← Changed
import ListingDetail from './pages/ListingDetail';     // ← Changed
import EditUser from './pages/EditUser';               // ← Changed
import EditListing from './pages/EditListing';         // ← Changed
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/create" element={<CreateListing />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/listings/edit/:id" element={<EditListing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;