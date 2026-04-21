import apiClient from "./client";

export const getDashboardStats = async () => {
  const res = await apiClient.get("/dashboard");
  return res.data;
};
