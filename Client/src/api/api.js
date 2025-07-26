import axios from "axios";
import { getToken, setToken, logout } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "foobar",
  },
});

// Attach the latest token before each request
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
