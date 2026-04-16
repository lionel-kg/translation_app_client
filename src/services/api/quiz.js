import apiClient from "./client";

export const generateQuiz = async (type, count = 10) => {
  const res = await apiClient.post("/quiz/generate", { type, count });
  return res.data;
};

export const getQuiz = async (id) => {
  const res = await apiClient.get(`/quiz/${id}`);
  return res.data;
};

export const getQuizResults = async (id) => {
  const res = await apiClient.get(`/quiz/${id}/results`);
  return res.data;
};

export const submitAnswer = async (questionId, answer) => {
  const res = await apiClient.post(`/quiz/${questionId}/answer`, { answer });
  return res.data;
};

export const getQuizHistory = async () => {
  const res = await apiClient.get("/quiz/history");
  return res.data;
};
