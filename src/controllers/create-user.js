import validator from "validator";
import { CreateUserUseCase } from "../use-cases/create-user.js";
import { badRequest, created, serverError } from "./helpers.js";
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

            const passwordIsValid = params.password.length > 6;
            if (!passwordIsValid) {
                return badRequest({
                    message: "Password must be at least 6 characters",
                });
            }

            const emailIsValid = validator.isEmail(params.email);
            if (!emailIsValid) {
                return badRequest({
                    message: "Invalid e-mail. Please provide a valid one.",
                });
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
