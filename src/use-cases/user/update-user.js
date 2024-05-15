import { EmailAlreadyInUseError } from "../../errors/user.js";
import bcrypt from "bcrypt";

export class UpdateUserUseCase {
    constructor(getUserByEmail, updateUserRepository) {
        this.getUserByEmail = getUserByEmail;
        this.updateUserRepository = updateUserRepository;
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userAlreadyExists = await this.getUserByEmail.execute(
                updateUserParams.email,
            );
            if (userAlreadyExists && userAlreadyExists.id !== userId) {
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

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        );
        return updatedUser;
    }
}
