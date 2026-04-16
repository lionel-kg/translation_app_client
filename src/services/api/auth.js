import apiClient from "./client";

export const loginUser = async (email, password) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (email, password) => {
  const res = await apiClient.post("/auth/register", { email, password });
  return res.data;
};

export const logoutUser = async () => {
  await apiClient.post("/auth/logout");
};

export const getMe = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await apiClient.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await apiClient.post("/auth/reset-password", { token, password });
  return res.data;
};
