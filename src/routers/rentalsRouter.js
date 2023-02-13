// dependencies
import { Router } from "express";

// controllers functions
import {
  deleteRental,
  getRentals,
  postRental,
  postRentalReturn,
} from "../controllers/rentals.js";

// schema validation
import validateSchema from "../middlewares/schemaMiddleware.js";
import rentalSchema from "../models/rentalsSchemas.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalSchema), postRental);
router.post("/rentals/:id/return", postRentalReturn);
router.delete("/rentals/:id", deleteRental);

export default router;
