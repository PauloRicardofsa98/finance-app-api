import { CreateTransactionController } from "../../controllers/transaction/create-transaction.js";
import { CreateTransactionUseCase } from "../../use-cases/transaction/create-transaction.js";
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from "../../repositories/postgres/index.js";

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    );

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    );

    return createTransactionController;
};
