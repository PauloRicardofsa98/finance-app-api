import { ZodError } from "zod";
import { UserNotFoundError } from "../../errors/user.js";
import { getUserBalanceSchema } from "../../schemas/user.js";
import {
    badRequest,
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
            const userId = request.params.userId;
            const from = request.query.from;
            const to = request.query.to;

            await getUserBalanceSchema.parseAsync({
                userId,
                from,
                to,
            });

            const balance = await this.getUserBalanceUseCase.execute(
                request.params.userId,
                from,
                to,
            );

            return ok(balance);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                });
            }
            console.log(error);
            return serverError();
        }
    }
}
