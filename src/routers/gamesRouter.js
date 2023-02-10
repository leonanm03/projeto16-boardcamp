import { Router } from "express";

import { getGames, postGame } from "../controllers/games.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import gameSchema from "../schemas/gamesSchemas.js";
const router = Router();

router.get("/games", getGames);
router.post("/games", validateSchema(gameSchema), postGame);

export default router;
