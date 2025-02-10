import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldsIsMissingResponse,
} from "../helpers/index.js";
import { badRequest, ok, serverError } from "../helpers/http.js";
import { userNotFoundResponse } from "../helpers/user.js";
import { getTransactionsByUserIdSchema } from "../../schemas/transaction.js";
import { ZodError } from "zod";

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
    }
    async execute(request) {
        try {
            const userId = request.query.userId;
            const from = request.query.from;
            const to = request.query.to;

            await getTransactionsByUserIdSchema.parseAsync({
                userId,
                from,
                to,
            });

            if (!userId) {
                return requiredFieldsIsMissingResponse("userId");
            }

            const userIdIsValid = checkIfIdIsValid(userId);
            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId);

            return ok(transactions);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                });
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message);
            }
            console.log(error);
            return serverError();
        }
    }
}
