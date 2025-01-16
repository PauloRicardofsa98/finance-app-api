import { UserNotFoundError } from "../../errors/user.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from "../helpers/index.js";

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase;
    }

    async execute(request) {
        try {
            const isIdValid = checkIfIdIsValid(request.params.userId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const balance = await this.getUserBalanceUseCase.execute(
                request.params.userId
            );

            return ok(balance);
        } catch (error) {
            console.log(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
