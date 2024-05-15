import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from "./helpers/index.js";
import { DeleteUserUseCase } from "../use-cases/index.js";

export class DeleteUserController {
    async execute(request) {
        try {
            const userId = request.params.userId;

            const isIdValid = checkIfIdIsValid(userId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const deleteUserUseCase = new DeleteUserUseCase();
            const deletedUser = await deleteUserUseCase.execute(userId);

            if (!deletedUser) {
                return userNotFoundResponse();
            }

            return ok(deletedUser);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
