import { Router } from "express";
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from "../factores/controllers/transaction.js";
import { auth } from "../middlewares/auth.js";

export const transactionRouter = Router();

transactionRouter.get("/", auth, async (req, res) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController();
    const { statusCode, body } = await getTransactionByUserIdController.execute(
        {
            ...req,
            query: {
                from: req.query.from,
                to: req.query.to,
                userId: req.userId,
            },
        },
    );
    res.status(statusCode).json(body);
});

transactionRouter.post("/", auth, async (req, res) => {
    const createTransactionController = makeCreateTransactionController();
    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            userId: req.userId,
        },
    });
    res.status(statusCode).json(body);
});

transactionRouter.patch("/:transactionId", auth, async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController();
    const { statusCode, body } = await updateTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            userId: req.userId,
        },
    });
    res.status(statusCode).json(body);
});
transactionRouter.delete("/:transactionId", auth, async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController();
    const { statusCode, body } = await deleteTransactionController.execute({
        ...req,
        body: {
            ...req.body,
            userId: req.userId,
        },
    });
    res.status(statusCode).json(body);
});
