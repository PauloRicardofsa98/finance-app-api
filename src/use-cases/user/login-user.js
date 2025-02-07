import { InvalidPasswordError, UserNotFoundError } from "../../errors/index.js";

export class LoginUserUseCase {
    constructor(getUserByEmailRepository, passwordComparator, tokensGenerator) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.passwordComparator = passwordComparator;
        this.tokensGenerator = tokensGenerator;
    }

    async execute(email, password) {
        const user = await this.getUserByEmailRepository.execute(email);
        if (!user) {
            throw new UserNotFoundError();
        }

        const isPasswordValid = await this.passwordComparator.execute(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new InvalidPasswordError();
        }

        const tokens = this.tokensGenerator.execute(user.id);

        return {
            ...user,
            tokens,
        };
    }
}
