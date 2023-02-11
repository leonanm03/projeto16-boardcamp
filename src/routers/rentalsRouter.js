import { Router } from "express";

import {
  deleteRental,
  getRentals,
  postRental,
  postRentalReturn,
} from "../controllers/rentals.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import rentalSchema from "../schemas/rentalsSchemas.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateSchema(rentalSchema), postRental);
router.post("/rentals/:id/return", postRentalReturn);
router.delete("/rentals/:id", deleteRental);

export default router;
