import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor (optional: for authentication)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Adjust based on your auth setup
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  check user is authorized or not
API.interceptors.response.use(
  (response) => response, // If response is OK, return it
  (error) => {
    if (error.response) {
      // Check if the token has expired
      console.log(error);
      if (error.response.status === 401) {
        console.log("Token expired. Logging out...");

        // Perform any task (e.g., logout user, redirect, clear storage)
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to login page
      }
    }
    return Promise.reject(error); // Reject the error for further handling
  }
);

// signup and login apis
export const getOtp = (email) =>
  API.get(`/api/v1/auth/send-otp/?email=${email}`);
export const verifyOtp = (email, otp) =>
  API.post(`/api/v1/auth/verify-otp`, { email, otp });
export const signup = (email, password, name) =>
  API.post(`/api/v1/auth/signup`, { email, password, name });
export const login = (email, password) =>
  API.post(`/api/v1/auth/login`, { email, password });
export const googleLogin = (code) =>
  API.get(`/api/v1/auth/google-login?code=${code}`);

// snippet apis
export const shareSnippet = (obj) =>
  API.post(`/api/v1/snippet/share-snippet`, obj);
export const getSnippets = () => API.get(`/api/v1/snippet`);
export const getSnippet = (snippetId) =>
  API.get(`/api/v1/snippet?snippetId=${snippetId}`);
export const deleteSnippet = (snippetId) =>
  API.delete(`/api/v1/snippet?snippetId=${snippetId}`);
export const starSnippet = (snippetId) =>
  API.post(`/api/v1/snippet/star-snippet`, { snippetId });

// user profile apis
export const getUserStats = () => API.get(`/api/v1/user/user-stats`);
export const getUserSnippets = () => API.get(`/api/v1/user/user-snippets`);
export const getUserStarredSnippets = () =>
  API.get(`/api/v1/user/starred-snippets`);

// snippet comment apis

export const getSnippetComments = (snippetId) =>
  API.get(`/api/v1/comment?snippetId=${snippetId}`);
export const doComment=(snippetId,content)=>
  API.post(`/api/v1/comment`,{snippetId,content});
export const deleteSnippetComment = (commentId) =>
  API.delete(`/api/v1/comment/${commentId}`);


export default API;
