import { Router } from "express";
import {
  exportApplicationsController,
  exportCandidatesController,
  getApplicationDetailController,
  getCandidateDetailController,
  getDashboardSummaryController,
  listApplicationsController,
  listCandidatesController,
  updateApplicationStatusController
} from "../controllers/adminController.js";
import {
  getProfileController,
  updatePasswordController,
  updateProfileController
} from "../controllers/accountController.js";
import { loginController, logoutController, meController } from "../controllers/authController.js";
import {
  bootstrapRootAccessController,
  getInternalReviewReportController,
  getRootConsoleController,
  importApplicationDocumentFromUrlController,
  listApplicationDocumentsController,
  supportRecoveryPrecheckController,
  uploadApplicationDocumentController
} from "../controllers/securityWorkflowController.js";
import { createRateLimiter } from "../middleware/security.js";
import {
  getAdmissionPeriodsController,
  getGuidesController,
  getMajorsController,
  getMyApplicationsController,
  getNotificationsController
} from "../controllers/studentController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const router = Router();
const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 7,
  message: "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút."
});

router.get("/health", (_req, res) => {
  res.json({ message: "ok" });
});

router.get(
  "/support/recovery/precheck",
  supportRecoveryPrecheckController
);
router.get(
  "/internal/review/report",
  getInternalReviewReportController
);
router.post(
  "/internal/ops/bootstrap",
  requireAuth,
  bootstrapRootAccessController
);
router.get(
  "/internal/root/console",
  requireAuth,
  requireRole("ROOT"),
  getRootConsoleController
);

router.post("/auth/login", loginRateLimiter, loginController);
router.post("/auth/logout", requireAuth, logoutController);
router.get("/auth/me", requireAuth, meController);
router.get("/user/me", requireAuth, meController);

router.get("/account/profile", requireAuth, getProfileController);
router.put("/account/profile", requireAuth, updateProfileController);
router.put("/account/password", requireAuth, updatePasswordController);
router.post("/user/me/change/password", requireAuth, updatePasswordController);

router.get("/huong-dan-su-dung/all", requireAuth, getGuidesController);
router.get("/notification/me", requireAuth, getNotificationsController);
router.get("/dot-tuyen-sinh/all", requireAuth, getAdmissionPeriodsController);
router.get("/nganh-chuyen-nganh/all", requireAuth, getMajorsController);
router.get("/ho-so-xet-tuyen/thi-sinh/my/many", requireAuth, getMyApplicationsController);
router.get(
  "/ho-so-xet-tuyen/:id/minh-chung",
  requireAuth,
  requireRole("CANDIDATE"),
  listApplicationDocumentsController
);
router.post(
  "/ho-so-xet-tuyen/:id/minh-chung",
  requireAuth,
  requireRole("CANDIDATE"),
  uploadApplicationDocumentController
);
router.post(
  "/ho-so-xet-tuyen/:id/minh-chung/import-url",
  requireAuth,
  requireRole("CANDIDATE"),
  importApplicationDocumentFromUrlController
);

router.get("/admin/dashboard/summary", requireAuth, requireRole("ADMIN"), getDashboardSummaryController);
router.get("/admin/applications", requireAuth, requireRole("ADMIN"), listApplicationsController);
router.get("/admin/applications/:id", requireAuth, requireRole("ADMIN"), getApplicationDetailController);
router.patch(
  "/admin/applications/:id/status",
  requireAuth,
  requireRole("ADMIN"),
  updateApplicationStatusController
);
router.get("/admin/candidates", requireAuth, requireRole("ADMIN"), listCandidatesController);
router.get("/admin/candidates/:id", requireAuth, requireRole("ADMIN"), getCandidateDetailController);
router.get(
  "/admin/export/applications.csv",
  requireAuth,
  requireRole("ADMIN"),
  exportApplicationsController
);
router.get(
  "/admin/export/candidates.csv",
  requireAuth,
  requireRole("ADMIN"),
  exportCandidatesController
);
