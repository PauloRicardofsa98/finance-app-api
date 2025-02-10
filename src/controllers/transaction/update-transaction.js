import { TransactionNotFoundError } from "../../errors/transaction.js";
import { ForbiddenError, UserNotFoundError } from "../../errors/index.js";
import { updateTransactionSchema } from "../../schemas/transaction.js";
import { forbidden, userNotFoundResponse } from "../helpers/index.js";
import {
    invalidIdResponse,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
    transactionNotFoundResponse,
} from "../helpers/index.js";

import { ZodError } from "zod";

export class UpdateTransactionController {
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

            await updateTransactionSchema.parseAsync(params);

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                );

            return ok(updatedTransaction);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse({ message: error.message });
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse();
            }

            if (error instanceof ForbiddenError) {
                return forbidden();
            }

            console.error(error);
            return serverError();
        }
    }
}
