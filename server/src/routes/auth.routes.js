import express from "express";
import {
  register,
  login,
  googleLogin,
  deleteAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.delete("/me", auth, deleteAccount);

router.get("/me", auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;