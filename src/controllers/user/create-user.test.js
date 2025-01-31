import { CreateUserController } from "./create-user";
import { EmailAlreadyInUseError } from "../../errors/user";
import { faker } from "@faker-js/faker";
import { user } from "../../tests";

describe("Create user Controller", () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const sut = new CreateUserController(createUserUseCase);

        return { createUserUseCase, sut };
    };

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    };

    it("should return 201 when creating a user successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(user);
    });

    it('should return 400 when "first_name" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "last_name" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "email" is not valid', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: "test",
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is not provided', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when "password" is less than 6 characters', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should call CreateUserUseCase with correct params", async () => {
        const { sut, createUserUseCase } = makeSut();
        const executeSpy = jest.spyOn(createUserUseCase, "execute");

        await sut.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it("should return 500 if CreateUserUseCase throws an exception", async () => {
        const { sut, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, "execute").mockRejectedValueOnce(
            new Error("Error")
        );

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it("should return 400 if CreateUserUseCase throws an EmailAlreadyInUseError", async () => {
        const { sut, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, "execute").mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email)
        );

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when zod throws an error", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            body: {
                first_name: "Paulo",
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });
});
