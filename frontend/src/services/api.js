import axios from "axios";

const BASE_URL =
    "https://unfazed-issue-macarena.ngrok-free.dev";
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