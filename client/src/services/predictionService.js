import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
const API = axios.create({
  baseURL,
});

export const predictDisease = async (formData) => {
  const token = localStorage.getItem("token");

  const { data } = await API.post("/predict", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
export const getPredictionHistory = async () => {
  const token = localStorage.getItem("token");

  const { data } = await API.get("/predict/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
