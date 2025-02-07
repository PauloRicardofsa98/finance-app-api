import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokenGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
        this.idGeneratorAdapter = idGeneratorAdapter;
        this.tokenGeneratorAdapter = tokenGeneratorAdapter;
    }

    async execute(createUserParams) {
        const userAlreadyExists = await this.getUserByEmailRepository.execute(
            createUserParams.email,
        );
        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = this.idGeneratorAdapter.execute();

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        );

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createdUser = await this.createUserRepository.execute(user);
        const tokens = this.tokenGeneratorAdapter.execute(userId);

        return { ...createdUser, tokens };
    }
}
