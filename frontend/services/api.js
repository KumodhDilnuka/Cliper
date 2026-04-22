import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add admin token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Questions ───────────────────────────────────────────
export const getQuestions = (search = "", sort = "newest") =>
  API.get("/questions", { params: { search, sort } });

export const getQuestion = (id) => API.get(`/questions/${id}`);

export const createQuestion = (data) => API.post("/questions", data);

export const updateQuestion = (id, data) => API.put(`/questions/${id}`, data);

export const deleteQuestion = (id) => API.delete(`/questions/${id}`);

export const upvoteQuestion = (id) => API.put(`/questions/${id}/upvote`);

export const downvoteQuestion = (id) => API.put(`/questions/${id}/downvote`);

// ─── Answers ─────────────────────────────────────────────
export const getAnswers = (questionId) =>
  API.get(`/questions/${questionId}/answers`);

export const createAnswer = (questionId, data) =>
  API.post(`/questions/${questionId}/answers`, data);

export const updateAnswer = (id, data) => API.put(`/answers/${id}`, data);

export const deleteAnswer = (id) => API.delete(`/answers/${id}`);

export const upvoteAnswer = (id) => API.put(`/answers/${id}/upvote`);

export const downvoteAnswer = (id) => API.put(`/answers/${id}/downvote`);

// ─── Admin ───────────────────────────────────────────────
export const adminLogin = (credentials) =>
  API.post("/admin/login", credentials);

export const getAdminStats = () =>
  API.get("/admin/stats");

export const getAdminQuestions = () =>
  API.get("/admin/questions");

export const approveQuestion = (id) =>
  API.put(`/admin/questions/${id}/approve`);

export const rejectQuestion = (id) =>
  API.put(`/admin/questions/${id}/reject`);

export const getAdminAnswers = (questionId) =>
  API.get(`/admin/questions/${questionId}/answers`);

export const deleteAdminAnswer = (id) =>
  API.delete(`/admin/answers/${id}`);