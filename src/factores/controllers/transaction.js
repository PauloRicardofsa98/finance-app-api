import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgressUpdateTransactionRepository,
} from "../../repositories/postgres/index.js";
import {
    GetTransactionsByUserIdUseCase,
    CreateTransactionUseCase,
    UpdateTransactionUseCase,
} from "../../use-cases/index.js";
import {
    GetTransactionsByUserIdController,
    CreateTransactionController,
    UpdateTransactionController,
} from "../../controllers/index.js";

export const makeGetTransactionByUserIdController = () => {
    const getTransactionsByUserId =
        new PostgresGetTransactionsByUserIdRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserId,
        getUserByIdRepository,
    );

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

    return getTransactionsByUserIdController;
};

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
export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgressUpdateTransactionRepository();

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    );

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    );

    return updateTransactionController;
};
