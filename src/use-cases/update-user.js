import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUseError } from "../errors/user.js";
import bcrypt from "bcrypt";

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const getUserByEmail = new PostgresGetUserByEmailRepository();
            const userAlreadyExists = await getUserByEmail.execute(
                updateUserParams.email,
            );
            if (userAlreadyExists) {
                throw new EmailAlreadyInUseError(updateUserParams.email);
            }
        }

        const user = { ...updateUserParams };

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            );
            user.password = hashedPassword;
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        );
        return updatedUser;
    }
}
