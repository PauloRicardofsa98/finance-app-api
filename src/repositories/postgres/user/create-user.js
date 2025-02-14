import { prisma } from "../../../../prisma/prisma.js";

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        const user = await prisma.user.create({
            data: {
                id: createUserParams.id,
                firstName: createUserParams.firstName,
                lastName: createUserParams.lastName,
                email: createUserParams.email,
                password: createUserParams.password,
            },
        });

        return user;
    }
}
