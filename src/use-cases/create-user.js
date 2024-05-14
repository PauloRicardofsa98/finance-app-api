import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import { PostgresGetUserByEmail } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserUseCase {
    async execute(createUserParams) {
        const getUserByEmail = new PostgresGetUserByEmail();
        const userAlreadyExists = await getUserByEmail.execute(
            createUserParams.email,
        );
        if (userAlreadyExists) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const postgresCreateUserRepository = new PostgresCreateUserRepository();

        return await postgresCreateUserRepository.execute(user);
    }
}
