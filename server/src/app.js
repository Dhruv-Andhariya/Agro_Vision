import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use(cookieParser());
app.use("/api/health", healthRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/predict", predictionRoutes);


export default app;