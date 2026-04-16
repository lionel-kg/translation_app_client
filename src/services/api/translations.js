import apiClient from "./client";

const getTranslation = async () => {
  try {
    const res = await apiClient.get("/translation");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const saveUserResponse = async (id, text) => {
  const res = await apiClient.put(`/translation/${id}`, {
    userResponse: text,
  });
  return res.data;
};

export { getTranslation, saveUserResponse };
