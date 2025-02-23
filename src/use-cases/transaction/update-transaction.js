import { ForbiddenError } from "../../errors/index.js";

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
        this.getTransactionByIdRepository = getTransactionByIdRepository;
    }

    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId);

        if (params?.userId && transaction?.userId !== params.userId) {
            throw new ForbiddenError();
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(
                transactionId,
                params,
            );

        return updatedTransaction;
    }
}
