import "dotenv/config.js";
import express from "express";

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from "./src/factores/controllers/user.js";
import { makeCreateTransactionController } from "./src/factores/controllers/transaction.js";

const app = express();
app.use(express.json());

app.get("/api/users/:userId", async (req, res) => {
    const getUserByIdController = makeGetUserByIdController();

    const { body, statusCode } = await getUserByIdController.execute(req);

    res.status(statusCode).json(body);
});
app.post("/api/users", async (req, res) => {
    const createUserController = makeCreateUserController();

    const { statusCode, body } = await createUserController.execute(req);
    res.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (req, res) => {
    const updateUserController = makeUpdateUserController();

    const { statusCode, body } = await updateUserController.execute(req);
    res.status(statusCode).json(body);
});

app.delete("/api/users/:userId", async (req, res) => {
    const deleteUserController = makeDeleteUserController();

    const { statusCode, body } = await deleteUserController.execute(req);
    res.status(statusCode).json(body);
});

app.post("/api/transacrions", async (req, res) => {
    const createTransacrionController = makeCreateTransactionController();
    const { statusCode, body } = await createTransacrionController.execute(req);
    res.status(statusCode).json(body);
});

app.listen(process.env.PORT, () =>
    console.log(`listenning on port ${process.env.PORT}`),
);
