import api from './api';

const listingService = {
  // Get all listings with pagination
  getListings: async (params = {}) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  // Get filter options
  getFilterOptions: async () => {
    const response = await api.get('/listings/filters/options');
    return response.data;
  },

  // Get listing by ID
  getListingById: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  // Create listing
  createListing: async (listingData) => {
    const response = await api.post('/listings', listingData);
    return response.data;
  },

  // Update listing
  updateListing: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  deleteListing: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

export default listingService;