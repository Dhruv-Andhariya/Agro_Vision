import fs from "fs";
import Prediction from "../models/prediction.model.js";
import { getPrediction } from "../services/ai.service.js";

export const predictDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const prediction = await getPrediction(req.file.path);

    const savedPrediction = await Prediction.create({
      user: req.user._id,
      imageUrl: req.file.path,
      predictedClass: prediction.disease,
      confidence: prediction.confidence,
      treatment: prediction.treatment,
    });

    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      prediction: savedPrediction,
    });
  } catch (error) {
    console.error(error);

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.status && error.data) {
      return res.status(error.status).json({
        success: false,
        message: error.data.message || error.data.treatment || "Prediction failed",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Prediction failed",
    });
  }
};
export const getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      predictions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch prediction history",
    });
  }
};