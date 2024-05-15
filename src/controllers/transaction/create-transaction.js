import validator from "validator";
import { UserNotFoundError } from "../../errors/user.js";
import {
    badRequest,
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    created,
} from "../helpers/index.js";

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }

    async execute(request) {
        try {
            const params = request.body;

            const requiredFields = [
                "id",
                "user_id",
                "name",
                "date",
                "amount",
                "type",
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` });
                }
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);
            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            if (params.amount <= 0) {
                return badRequest({
                    meessage: "The ammount must be greater than 0.",
                });
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_decimal: false,
                    decimal_separator: ".",
                },
            );

            if (!amountIsValid) {
                return badRequest({
                    message: "the amount must be a valid currency",
                });
            }

            const type = params.type.trim().toUpperCase();
            const typeIsValid = ["EARNING", "EXPENSE", "INVESTIMENT"].includes(
                type,
            );

            if (!typeIsValid) {
                return badRequest({ message: "" });
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            });

            return created(transaction);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
