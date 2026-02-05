import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["x-auth-token"] = token;
  }
  return req;
});

// --- Authentication ---
export const signup = (formData) => API.post("/auth/signup", formData);
export const signin = (formData) => API.post("/auth/signin", formData);

// --- User ---
export const fetchProfile = () => API.get("/users/me");

// --- Products ---
export const fetchProducts = () => API.get("/products");
export const createProduct = (formData) => API.post("/products", formData); // New function

// --- Cart ---
export const fetchCart = () => API.get("/cart");
export const addToCart = (productId, quantity) =>
  API.post("/cart", { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  API.put(`/cart/${productId}`, { quantity });
export const deleteCartItem = (productId) => API.delete(`/cart/${productId}`);

export default API;
