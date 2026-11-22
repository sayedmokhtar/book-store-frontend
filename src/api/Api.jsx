import axios from "axios";
const Api = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://127.0.0.1:5000/api"
    : "https://book-store-api-1t03.onrender.com/api",
  withCredentials: true,
});
export default Api;
