import { Router } from "express";

import { getCustomers, postCustomer } from "../controllers/customers.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import customerSchema from "../schemas/customerSchemas.js";

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", validateSchema(customerSchema), postCustomer);

export default router;
