import axios from "axios";

const BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://online-exam-portal-7agm.onrender.com";

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