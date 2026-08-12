import express from "express";
import authRoutes from "./auth.routes.js";
import interviewRoutes from "./interview.routes.js";
import resumeRoutes from "./resume.routes.js";
import historyRoutes from "./history.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/interview", interviewRoutes);
router.use("/resume", resumeRoutes);
router.use("/history", historyRoutes);

export default router;