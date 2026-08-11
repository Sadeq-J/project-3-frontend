import axios from "axios";
const API_URL =
  import.meta.env.VITE_BACKEND_SERVER_URL || "http://localhost:3000";
export const getVenues = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/venues`, {
    params: filters,
  });
  return response.data;
};
export const getVenueById = async (id) => {
  const response = await axios.get(`${API_URL}/venues/${id}`);
  return response.data;
};
export const updateVenueById = async (id, venueData) => {
  const response = await axios.put(`${API_URL}/venues/${id}`, venueData);
  return response.data;
};
