import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
const API = axios.create({
  baseURL: `${baseURL}/auth`,
});

export const registerUser = async (userData) => {
  const res = await API.post("/register", userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await API.post("/login", userData);
  return res.data;
};

export const loginWithGoogle = async (credential, mode = "login") => {
  const res = await API.post("/google", { credential, mode });
  return res.data;
};

export const getCurrentUser = async (token) => {
  const res = await API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await API.post(`/reset-password/${token}`, { password });
  return res.data;
};

export const deleteCurrentUser = async (token) => {
  const res = await API.delete("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
