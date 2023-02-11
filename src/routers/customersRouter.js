import { Router } from "express";

import {
  getCustomerById,
  getCustomers,
  postCustomer,
  putCustomer,
} from "../controllers/customers.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import customerSchema from "../schemas/customerSchemas.js";

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", validateSchema(customerSchema), postCustomer);
router.get("/customers/:id", getCustomerById);
router.put("/customers/:id", validateSchema(customerSchema), putCustomer);

export default router;
