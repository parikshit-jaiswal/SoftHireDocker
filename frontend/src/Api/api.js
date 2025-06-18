import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;