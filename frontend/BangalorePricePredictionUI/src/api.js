import axios from "axios";

const API_BASE_URL = "https://bangalore-home-price-prediction-gpvp.onrender.com";  //http://127.0.0.1:8000/api

export const getLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/get_locations/`);
  return response.data.locations;
};

export const predictHomePrice = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/predict_home_price/`, formData);
  return response.data;
};