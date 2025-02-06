import { EmailAlreadyInUseError } from "../../errors/user.js";

export class UpdateUserUseCase {
    constructor(getUserByEmail, updateUserRepository, passwordHasherAdapter) {
        this.getUserByEmail = getUserByEmail;
        this.updateUserRepository = updateUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
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
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
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
