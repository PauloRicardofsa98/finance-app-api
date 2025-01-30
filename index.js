import "dotenv/config.js";

import express from "express";
import { transactionRouter, userRouter } from "./src/routes/index.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);

app.listen(process.env.PORT, () =>
    console.log(`listenning on port ${process.env.PORT}`)
);
