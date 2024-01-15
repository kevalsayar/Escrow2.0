import axios from "axios";

const axiosIntance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
  timeout: 60000,
});

axiosIntance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response.data.code === 400) return error.response.data;
    throw new Error(error.response.data.message);
  }
);

export default axiosIntance;
