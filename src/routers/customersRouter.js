// dependencies
import { Router } from "express";

// controllers functions
import {
  getCustomerById,
  getCustomers,
  postCustomer,
  putCustomer,
} from "../controllers/customers.js";

// schema validation
import validateSchema from "../middlewares/schemaMiddleware.js";
import customerSchema from "../models/customerSchemas.js";

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", validateSchema(customerSchema), postCustomer);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", validateSchema(customerSchema), putCustomer);

export default router;
