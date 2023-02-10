import { Router } from "express";

import { getRentals, postRental } from "../controllers/rentals.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import rentalSchema from "../schemas/rentalsSchemas.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalSchema), postRental);

export default router;
