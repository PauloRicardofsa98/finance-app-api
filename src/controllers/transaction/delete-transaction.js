import { TransactionNotFoundError } from "../../errors/transaction.js";
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from "../helpers/index.js";

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase;
    }

    async execute(request) {
        try {
            const transactionId = request.params.transactionId;

            const isIdValid = checkIfIdIsValid(transactionId);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId);

            return ok(deletedTransaction);
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse();
            }
            console.log(error);
            return serverError();
        }
    }
}
