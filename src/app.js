import express from "express";
import { transactionRouter, userRouter } from "./routes/index.js";

export const app = express();
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
