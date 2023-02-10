// dependencies:
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// routers:
import routers from "./routers/appRouters.js";

// APP:
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// ROUTES:
app.use(routers);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in PORT: ${PORT}`));
