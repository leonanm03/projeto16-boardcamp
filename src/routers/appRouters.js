// dependencies
import { Router } from "express";

// controllers routers
import rentalsRouter from "./rentalsRouter.js";
import gamesRouter from "./gamesRouter.js";
import customersRouter from "./customersRouter.js";

const router = Router();

router.use(rentalsRouter);
router.use(gamesRouter);
router.use(customersRouter);

export default router;
