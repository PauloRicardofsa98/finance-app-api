import { Router } from "express";
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
} from "../factores/controllers/user.js";
import { auth } from "../middlewares/auth.js";

export const userRouter = Router();

userRouter.get("/", auth, async (req, res) => {
    const getUserByIdController = makeGetUserByIdController();

    const { body, statusCode } = await getUserByIdController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    });

    res.status(statusCode).json(body);
});
userRouter.get("/balance", auth, async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController();

    const { body, statusCode } = await getUserBalanceController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
        query: {
            from: req.query.from,
            to: req.query.to,
        },
    });

    res.status(statusCode).json(body);
});
userRouter.post("/", async (req, res) => {
    const createUserController = makeCreateUserController();

    const { statusCode, body } = await createUserController.execute(req);
    res.status(statusCode).json(body);
});

userRouter.patch("/", auth, async (req, res) => {
    const updateUserController = makeUpdateUserController();

    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    });
    res.status(statusCode).json(body);
});

userRouter.delete("/", auth, async (req, res) => {
    const deleteUserController = makeDeleteUserController();

    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: {
            userId: req.userId,
        },
    });
    res.status(statusCode).json(body);
});

userRouter.post("/login", async (req, res) => {
    const loginUserController = makeLoginUserController();

    const { statusCode, body } = await loginUserController.execute(req);
    res.status(statusCode).json(body);
});

userRouter.post("/refresh-token", async (req, res) => {
    const refreshTokenController = makeRefreshTokenController();

    const { statusCode, body } = await refreshTokenController.execute(req);
    res.status(statusCode).json(body);
});
