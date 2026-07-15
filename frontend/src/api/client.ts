import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});