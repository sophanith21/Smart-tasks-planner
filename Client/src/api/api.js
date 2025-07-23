import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "foobar",
  },
});

export default api;
