export class TransactionNotFoundError extends Error {
    constructor(TransactionId) {
        super(`Transaction with id ${TransactionId} was not found.`);
        this.name = "TransactionNotFoundError";
    }
}
