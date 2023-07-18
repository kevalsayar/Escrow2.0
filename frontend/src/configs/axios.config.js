import axios from "axios";

const axiosIntance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
  timeout: 5000,
});

// axiosIntance.interceptors.request.use(
//   (configs) => {
//     configs.headers["Authorization"] = localStorage.getItem(LS_KEYS.AUTH_TOKEN)
//       ? `Bearer ${localStorage.getItem(LS_KEYS.AUTH_TOKEN)}`
//       : null;
//     return configs;
//   },
//   (error) => Promise.reject(error)
// );

axiosIntance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default axiosIntance;
