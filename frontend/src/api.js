const BASE = "/api";
const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem("nexus_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const apiLogin = (email, password) =>
  fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }).then(handle);

export const apiRegister = (name, email, password) =>
  fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) }).then(handle);

export const apiGetProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/products${qs ? "?" + qs : ""}`, { headers: getHeaders() }).then(handle);
};

export const apiCreateProduct = (data) =>
  fetch(`${BASE}/products`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handle);

export const apiUpdateProduct = (id, data) =>
  fetch(`${BASE}/products/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handle);

export const apiDeleteProduct = (id) =>
  fetch(`${BASE}/products/${id}`, { method: "DELETE", headers: getHeaders() }).then(handle);

export const apiPlaceOrder = (items) =>
  fetch(`${BASE}/orders`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ items }) }).then(handle);

export const apiGetMyOrders = () =>
  fetch(`${BASE}/orders/my`, { headers: getHeaders() }).then(handle);

export const apiGetAllOrders = () =>
  fetch(`${BASE}/orders`, { headers: getHeaders() }).then(handle);

export const apiGetOrderStats = () =>
  fetch(`${BASE}/orders/stats`, { headers: getHeaders() }).then(handle);
