import express from "express";
import { transactionRouter, userRouter } from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);

const swaggerDocument = JSON.parse(
    fs.readFileSync(join(__dirname, "../docs/swagger.json"), "utf-8"),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
