import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const getPrediction = async (imagePath) => {
  const formData = new FormData();
  const extension = path.extname(imagePath).toLowerCase();
  const contentType = extension === ".png"
    ? "image/png"
    : extension === ".jpg" || extension === ".jpeg"
      ? "image/jpeg"
      : "application/octet-stream";

  formData.append("file", fs.createReadStream(imagePath), {
    filename: path.basename(imagePath),
    contentType,
  });

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const serviceError = new Error("AI service error");
      serviceError.status = error.response.status;
      serviceError.data = error.response.data;
      throw serviceError;
    }

    throw error;
  }
};