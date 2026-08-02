import express from "express";
import upload from "../middleware/upload.middleware.js";
import { predictDisease } from "../controllers/prediction.controller.js";
import auth from "../middleware/auth.middleware.js";
import {
  getPredictionHistory,
} from "../controllers/prediction.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  upload.single("image"),
  predictDisease
);
router.get(
  "/history",
  auth,
  getPredictionHistory
);

export default router;