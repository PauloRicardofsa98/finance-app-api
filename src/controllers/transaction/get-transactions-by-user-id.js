import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldsIsMissingResponse,
} from "../helpers/index.js";
import { ok, serverError } from "../helpers/http.js";
import { userNotFoundResponse } from "../helpers/user.js";

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
                await this.getTransactionsByUserIdUseCase.execute(userId);

            return ok(transactions);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message);
            }
            console.log(error);
            return serverError();
        }
    }
}
