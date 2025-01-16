import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
        this.idGeneratorAdapter = idGeneratorAdapter;
    }

    async execute(createUserParams) {
        const userAlreadyExists = await this.getUserByEmailRepository.execute(
            createUserParams.email
        );
        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = this.idGeneratorAdapter.execute();

        const hashedPassword = this.passwordHasherAdapter.execute(
            createUserParams.password
        );

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        return await this.createUserRepository.execute(user);
    }
}
