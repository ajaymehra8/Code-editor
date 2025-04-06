import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_APP_API_URL||"http://localhost:8000", // Replace with your actual API base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor (optional: for authentication)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Adjust based on your auth setup
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// signup and login apis
export const getOtp=(email)=>API.get(`/api/v1/auth/get-otp/?email=${email}`);
export const verifyOtp=(email,otp)=>API.post(`/api/v1/auth/verify-otp`,{email,otp});
export const signup=(email)=>API.post(`/api/v1/auth/signup`,{email,password});
export const login=(email,password)=>API.post(`/api/v1/auth/login`,{email,password});




export default API;
