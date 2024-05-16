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
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from "../helpers/transaction.js";

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

            const amountIsValid = checkIfAmountIsValid(params.amount);

            if (!amountIsValid) {
                return invalidAmountResponse();
            }

            const type = params.type.trim().toUpperCase();
            const typeIsValid = checkIfTypeIsValid(type);

            if (!typeIsValid) {
                return invalidTypeResponse();
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
