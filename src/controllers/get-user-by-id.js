import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from "./helpers/index.js";
import { GetUserByIdUseCase } from "../use-cases/index.js";

export class GetUserByIdController {
    async execute(request) {
        try {
            const isIdValid = checkIfIdIsValid(request.params.userId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();
            const user = await getUserByIdUseCase.execute(
                request.params.userId,
            );

            if (!user) {
                return notFound({
                    message: "User not found",
                });
            }

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
