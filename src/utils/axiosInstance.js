import axios from "axios";

const isDevelopment = import.meta.env.DEV;

const api = axios.create({
    baseURL: isDevelopment
        ? "/api"
        : import.meta.env.VITE_API_URL
    ,
    timeout: 10000
});

export default api;