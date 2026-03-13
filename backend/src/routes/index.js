import { Router } from "express";
import { loginController, meController } from "../controllers/authController.js";
import {
  getProfileController,
  updatePasswordController,
  updateProfileController
} from "../controllers/accountController.js";
import { requireAuth } from "../middleware/auth.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ message: "ok" });
});

router.post("/auth/login", loginController);
router.get("/auth/me", requireAuth, meController);
router.get("/account/profile", requireAuth, getProfileController);
router.put("/account/profile", requireAuth, updateProfileController);
router.put("/account/password", requireAuth, updatePasswordController);
