import { EmailAlreadyInUseError } from "../errors/user.js";
import {
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    invalidIdResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from "./helpers/index.js";

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

            const allowedFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];
            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );
            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: "Some provided field is not allowed",
                });
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password);
                if (!passwordIsValid) {
                    return invalidPasswordResponse();
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email);
                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse();
                }
            }

            const updateduser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updateduser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
