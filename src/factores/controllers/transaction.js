import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
} from "../../repositories/postgres/index.js";
import {
    GetTransactionsByUserIdUseCase,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
} from "../../use-cases/index.js";
import {
    GetTransactionsByUserIdController,
    CreateTransactionController,
    UpdateTransactionController,
    DeleteTransactionController,
} from "../../controllers/index.js";

import { IdGeneratorAdapter } from "../../adapters/index.js";

export const makeGetTransactionByUserIdController = () => {
    const getTransactionsByUserId =
        new PostgresGetTransactionsByUserIdRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserId,
        getUserByIdRepository
    );

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

    return getTransactionsByUserIdController;
};

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const idGeneratorAdapter = new IdGeneratorAdapter();

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter
    );

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase
    );

    return createTransactionController;
};
export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository();

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository
    );

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase
    );

    return updateTransactionController;
};
export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository();

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository
    );

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase
    );

    return deleteTransactionController;
};
