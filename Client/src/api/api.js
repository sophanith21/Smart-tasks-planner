import axios from "axios";

//For development only
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const baseURL = isLocalhost
  ? "http://localhost:3000/api"
  : "http://192.168.0.10:3000/api";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
