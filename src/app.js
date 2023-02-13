// dependencies:
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routers
import routers from "./routers/appRouters.js";

dotenv.config();

// APP:
const app = express();
app.use(cors());
app.use(express.json());

// ROUTES:
app.use(routers);

// SERVER:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in PORT: ${PORT}`));
