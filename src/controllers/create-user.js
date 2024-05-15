import { CreateUserUseCase } from "../use-cases/create-user.js";
import {} from "./helpers/http.js";
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
} from "./helpers/index.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserController {
    async execute(request) {
        try {
            const params = request.body;

            const requiredFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` });
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);
            if (!passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);
            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse();
            }

            const createUserCase = new CreateUserUseCase();

            const user = await createUserCase.execute(params);

            return created(user);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
