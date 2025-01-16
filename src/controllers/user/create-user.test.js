import { CreateUserController } from "./create-user";
import { faker } from "@faker-js/faker";

describe("Create user Controller", () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    it("should return 201 when creating a user successfully", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
        expect(result.body).not.toBeNull();
        expect(result.body).not.toBeUndefined();
    });

    it('should return 400 when "first_name" is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );

        const httpRequest = {
            body: {
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "last_name" is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not valid', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: "test",
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is less than 6 characters', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 5,
                }),
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 500 if CreateUserUseCase throws an exception", async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase
        );
        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            },
        };

        jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
            throw new Error("Error");
        });

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });
});
