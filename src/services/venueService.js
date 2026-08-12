import API from './api';
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:3000";

const getVenues = async (filters = {}) => {
  const response = await API.get('/venues', {
    params: filters,
  });
  return response.data;
};

const getVenueById = async (id) => {
  const response = await API.get(`/venues/${id}`);
  return response.data;
};

const createVenue = async (venueData) => {
  const response = await API.post('/admin/venues', venueData);
  return response.data;
};

const updateVenueById = async (id, venueData) => {
  const response = await API.put(`/admin/venues/${id}`, venueData);
  return response.data;
};

const getAdminVenueById = async (id) => {
  const response = await API.get(`/admin/venues/${id}`);
  return response.data;
};


export { getVenueById, getAdminVenueById, getVenues, createVenue, updateVenueById };
