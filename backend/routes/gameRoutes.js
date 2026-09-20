import { Router } from "express";

import { createGame, deleteGame, getGame, joinGame, leaveGame, listGames, listMyGames, updateGame } from "../controllers/gameController.js";
import requireAuth from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuthMiddleware.js";

const router = Router();

router.get("/", optionalAuth, listGames);
router.get("/my", requireAuth, listMyGames);
router.post("/", requireAuth, createGame);
router.post("/:gameId/join", requireAuth, joinGame);
router.delete("/:gameId/leave", requireAuth, leaveGame);
router.get("/:gameId", optionalAuth, getGame);
router.put("/:gameId", requireAuth, updateGame);
router.delete("/:gameId", requireAuth, deleteGame);

export default router;
