import apiClient from "./client";

export const getWords = async () => {
  try {
    const res = await apiClient.get("/words");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
