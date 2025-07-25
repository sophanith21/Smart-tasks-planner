import axios from "axios";

//For development only

const baseURL = `http://${window.location.hostname}:3000/api`;

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
