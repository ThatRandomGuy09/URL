import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const registerUser = (data) => api.post("/auth/signin", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const createLink = (data, token) =>
  api.post("/links", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getLinks = (token) =>
  api.get("/links", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getAnalytics = (shortUrl, token) =>
  api.get(`/analytics/${shortUrl}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
