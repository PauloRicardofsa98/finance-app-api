import { UserNotFoundError } from "../../errors/user";
import { badRequest, ok, serverError } from "../helpers/http";
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from "../helpers/transaction";
import { checkIfIdIsValid, invalidIdResponse } from "../helpers/validation";

export class UpdateTransacrtionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase;
    }

    async execute(request) {
        try {
            const transactionId = request.params.transactionId;

            const isIdValid = checkIfIdIsValid(transactionId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = request.body;

            const allowedFields = ["name", "date", "amount", "type"];

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );
            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: "Some provided field is not allowed",
                });
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount);
                if (!amountIsValid) {
                    return invalidAmountResponse();
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type);
                if (!typeIsValid) {
                    return invalidTypeResponse();
                }
            }

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                );

            return ok(updatedTransaction);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
