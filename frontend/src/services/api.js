import axios from "axios";

const BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://online-exam-portal-production-3a2f.up.railway.app";

const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

export default API;