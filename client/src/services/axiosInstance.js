import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://69713b0978fec16a63005a3b.mockapi.io/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
