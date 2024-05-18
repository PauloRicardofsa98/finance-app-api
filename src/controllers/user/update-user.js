import { EmailAlreadyInUseError } from "../../errors/user.js";
import { updateUserSchema } from "../../schemas/user.js";
import {
    invalidIdResponse,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from "../helpers/index.js";

import { ZodError } from "zod";

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }

    async execute(request) {
        try {
            const userId = request.params.userId;

            const isIdValid = checkIfIdIsValid(userId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = request.body;

            await updateUserSchema.parseAsync(params);

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
