import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getLeaderboard = () => api.get("/leaderboard");
export const getProblem = (id) => api.get(`/problems/${id}`);
export const getProblems = () => api.get("/problems");
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => api.post("/auth/register", userData);
export const submitSolution = (problemId, code, language) => 
  api.post(`/submissions`, { problemId, code, language });

export default api;
