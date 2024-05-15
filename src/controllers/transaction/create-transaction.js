import validator from "validator";
import { UserNotFoundError } from "../../errors/user.js";
import {
    badRequest,
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    created,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
} from "../helpers/index.js";

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }

    async execute(request) {
        try {
            const params = request.body;

            const requiredFields = [
                "user_id",
                "name",
                "date",
                "amount",
                "type",
            ];

            const { ok, missingField } = validateRequiredFields(
                params,
                requiredFields,
            );
            if (!ok) {
                return requiredFieldsIsMissingResponse(missingField);
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);
            if (!userIdIsValid) {
                return invalidIdResponse();
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
                return badRequest({
                    message: "The type must be EARNING, EXPENSE, INVESTIMENT.",
                });
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
