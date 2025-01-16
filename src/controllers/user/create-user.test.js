import { CreateUserController } from "./create-user";
import { EmailAlreadyInUseError } from "../../errors/user";
import { faker } from "@faker-js/faker";

describe("Create user Controller", () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const sut = new CreateUserController(createUserUseCase);

        return { createUserUseCase, sut };
    };

    it("should return 201 when creating a user successfully", async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(httpRequest.body);
    });

    it('should return 400 when "first_name" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "last_name" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not valid', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is less than 6 characters', async () => {
        //arrange
        const { sut } = makeSut();

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
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should call CreateUserUseCase with correct params", async () => {
        const { sut, createUserUseCase } = makeSut();

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

        const executeSpy = jest.spyOn(createUserUseCase, "execute");

        await sut.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it("should return 500 if CreateUserUseCase throws an exception", async () => {
        const { sut } = makeSut();

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

        jest.spyOn(sut, "execute").mockImplementationOnce(() => {
            throw new Error("Error");
        });

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it("should return 400 if CreateUserUseCase throws an EmailAlreadyInUseError", async () => {
        const { sut } = makeSut();

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

        jest.spyOn(sut, "execute").mockImplementationOnce(() => {
            throw new EmailAlreadyInUseError();
        });

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });
});
