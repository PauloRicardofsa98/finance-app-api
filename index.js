import "dotenv/config.js";

import express from "express";

import { userRouter } from "./src/routes/user.js";
import { transactionRouter } from "./src/routes/transactions.js";

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);

app.listen(process.env.PORT, () =>
    console.log(`listenning on port ${process.env.PORT}`)
);
