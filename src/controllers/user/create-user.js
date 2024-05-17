import { badRequest, created, serverError } from "../helpers/index.js";
import { EmailAlreadyInUseError } from "../../errors/user.js";
import { ZodError } from "zod";
import { createUserSchema } from "../../schemas/user.js";

export class CreateUserController {
    constructor(createUserCase) {
        this.createUserCase = createUserCase;
    }

    async execute(request) {
        try {
            const params = request.body;

            await createUserSchema.parseAsync(params);

            const user = await this.createUserCase.execute(params);

            return created(user);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
