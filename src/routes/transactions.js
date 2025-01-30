import { Router } from "express";
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from "../factores/controllers/transaction.js";

export const transactionRouter = Router();

transactionRouter.get("/", async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController();
    const { statusCode, body } = await getTransactionByUserIdController.execute(
        req
    );
    res.status(statusCode).json(body);
});

transactionRouter.post("/", async (req, res) => {
    const createTransactionController = makeCreateTransactionController();
    const { statusCode, body } = await createTransactionController.execute(req);
    res.status(statusCode).json(body);
});

transactionRouter.patch("/:transactionId", async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController();
    const { statusCode, body } = await updateTransactionController.execute(req);
    res.status(statusCode).json(body);
});
transactionRouter.delete("/:transactionId", async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController();
    const { statusCode, body } = await deleteTransactionController.execute(req);
    res.status(statusCode).json(body);
});
