// dependencies
import { Router } from "express";

// controllers functions
import { getGames, postGame } from "../controllers/games.js";

// schema validation
import validateSchema from "../middlewares/schemaMiddleware.js";
import gameSchema from "../models/gamesSchemas.js";
const router = Router();

router.get("/games", getGames);
router.post("/games", validateSchema(gameSchema), postGame);

export default router;
