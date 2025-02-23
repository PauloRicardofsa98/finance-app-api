import { ZodError } from "zod";
import { InvalidPasswordError, UserNotFoundError } from "../../errors/index.js";
import { loginSchema } from "../../schemas/index.js";
import {
    badRequest,
    ok,
    serverError,
    unauthorized,
    userNotFoundResponse,
} from "../helpers/index.js";

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase;
    }
    async execute(request) {
        try {
            const { email, password } = request.body;

            await loginSchema.parseAsync({ email, password });

            const user = await this.loginUserUseCase.execute(email, password);
            return ok(user);
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            if (error instanceof InvalidPasswordError) {
                return unauthorized();
            }
            if (error instanceof ZodError) {
                badRequest(error.errors);
            }
            console.log(error);
            return serverError();
        }
    }
}
