import { Router } from "express";

import { getGames } from "../controllers/games.js";
const router = Router();

router.get("/games", getGames);

export default router;
