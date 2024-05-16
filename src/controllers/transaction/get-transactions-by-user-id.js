import { UserNotFoundError } from "../../errors/user";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldsIsMissingResponse,
} from "../helpers";
import { ok, serverError } from "../helpers/http";
import { userNotFoundResponse } from "../helpers/user";

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
    }
    async execute(request) {
        try {
            const userId = request.query.userId;
            if (!userId) {
                return requiredFieldsIsMissingResponse("userId");
            }

            const userIdIsValid = checkIfIdIsValid(userId);
            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId });

            return ok(transactions);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message);
            }
            return serverError();
        }
    }
}
