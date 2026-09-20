import { Router } from "express";

import requireAuth from "../middleware/authMiddleware.js";
import { getMyProfile, updateMyProfile, upsertProfile } from "../controllers/userController.js";

const router = Router();

router.post("/profile", requireAuth, upsertProfile);
router.get("/me", requireAuth, getMyProfile);
router.put("/me", requireAuth, updateMyProfile);

export default router;
