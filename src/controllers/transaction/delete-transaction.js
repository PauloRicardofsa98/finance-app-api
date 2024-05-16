import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from "../helpers/index.js";

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase;
    }

    async execute(request) {
        try {
            const transactionId = request.params.userId;

            const isIdValid = checkIfIdIsValid(transactionId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId);

            if (!deletedTransaction) {
                return userNotFoundResponse();
            }

            return ok(deletedTransaction);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
