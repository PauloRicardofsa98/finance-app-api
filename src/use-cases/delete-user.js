import { PostgresDeleteUserRepository } from "../repositories/postgres/index.js";

export class DeleteUserByIdUseCase {
    async execute(userId) {
        const deleteUserRepository = new PostgresDeleteUserRepository();
        const deletedUser = await deleteUserRepository.execute(userId);
        return deletedUser;
    }
}
