import axios from "axios";

const API = axios.create({
  baseURL: "https://online-exam-portal-7agm.onrender.com",
});

export default API;