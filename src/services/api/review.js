import apiClient from "./client";

export const getDueWords = async () => {
  const res = await apiClient.get("/review/due");
  return res.data;
};

export const submitReview = async (wordId, quality) => {
  const res = await apiClient.post(`/review/${wordId}/review`, { quality });
  return res.data;
};
