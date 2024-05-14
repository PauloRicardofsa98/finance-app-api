import { badRequest, serverError } from "./helpers.js";
import { GetUserByIdUseCase } from "../use-cases/get-user-by-id.js";
import validator from "validator";

export class GetUserByIdController {
    async execute(request) {
        try {
            const isIdValid = validator.isUUID(request.params.userId);
            if (!isIdValid) {
                return badRequest({ message: "The provided is not valid." });
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();
            const user = await getUserByIdUseCase.execute(
                request.params.userId,
            );

            return {
                statusCode: 200,
                body: user,
            };
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
