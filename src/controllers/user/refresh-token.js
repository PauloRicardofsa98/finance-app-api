import { ZodError } from "zod";
import { UnauthorizedError } from "../../errors/index.js";
import { refreshTokenSchema } from "../../schemas/index.js";
import { badRequest, ok, serverError, unauthorized } from "../helpers/index.js";

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    async execute(req) {
        try {
            const params = req.body;

            await refreshTokenSchema.parseAsync(params);

            const response = this.refreshTokenUseCase.execute(
                params.refreshToken,
            );

            return ok(response);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return unauthorized();
            }

            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }

            console.log(error);
            return serverError();
        }
    }
}
