import { UserNotFoundError } from "../../errors/user";

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId);
        if (!user) {
            throw new UserNotFoundError(params.userId);
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(params);

        return updatedTransaction;
    }
}
