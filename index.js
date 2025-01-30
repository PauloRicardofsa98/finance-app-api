import "dotenv/config.js";

import express from "express";

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from "./src/factores/controllers/transaction.js";
import { userRouter } from "./src/routes/user.js";

const app = express();
app.use(express.json());

app.use("/api/users", userRouter);

app.get("/api/transactions", async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController();
    const { statusCode, body } = await getTransactionByUserIdController.execute(
        req
    );
    res.status(statusCode).json(body);
});
app.post("/api/transactions", async (req, res) => {
    const createTransacrionController = makeCreateTransactionController();
    const { statusCode, body } = await createTransacrionController.execute(req);
    res.status(statusCode).json(body);
});
app.patch("/api/transactions/:transactionId", async (req, res) => {
    const updateTransacrionController = makeUpdateTransactionController();
    const { statusCode, body } = await updateTransacrionController.execute(req);
    res.status(statusCode).json(body);
});
app.delete("/api/transactions/:transactionId", async (req, res) => {
    const deleteTransacrionController = makeDeleteTransactionController();
    const { statusCode, body } = await deleteTransacrionController.execute(req);
    res.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
    console.log(`listenning on port ${process.env.PORT}`)
);
