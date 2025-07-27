import axios from "axios";
import { getToken, setToken, logout } from "../utils/auth";

//For development only

const baseURL = `http://${window.location.hostname}:3000/api`;

const api = axios.create({
  baseURL: baseURL,
  timeout: 300000, // 5 minutes
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to store the token
api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
