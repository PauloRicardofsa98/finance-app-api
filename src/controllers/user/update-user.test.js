import { faker } from "@faker-js/faker";
import { UpdateUserController } from "./update-user";
import { EmailAlreadyInUseError, UserNotFoundError } from "../../errors/user";
import { user } from "../../tests";

describe("Update User Controller", () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub();
        const sut = new UpdateUserController(updateUserUseCase);

        return { sut, updateUserUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 8,
            }),
        },
    };

    it("should return 200 with updated user", async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when "password" is less than 6 characters', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when "email" is invalid', async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: "invalid-email",
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 400 when 'userId' is invalid", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: {
                userId: "invalid-id",
            },
            body: httpRequest.body,
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 400 if CreateUserUseCase throws an EmailAlreadyInUseError", async () => {
        const { sut, updateUserUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateUserUseCase, "execute")
            .mockRejectedValueOnce(
                new EmailAlreadyInUseError(httpRequest.body.email),
            );

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it("should return 400 when a unhallowed field is provided", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unhallowed_field: "test",
            },
        });

        //assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 500 if CreateUserUseCase throws an exception", async () => {
        const { sut, updateUserUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateUserUseCase, "execute")
            .mockRejectedValueOnce(new Error());

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it("should call CreateUserUseCase with correct values", async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut();
        const spy = import.meta.jest.spyOn(updateUserUseCase, "execute");

        //act
        await sut.execute(httpRequest);

        //assert
        expect(spy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        );
    });

    it("should return 404 if CreateUserUseCase throws an UserNotFoundError", async () => {
        const { sut, updateUserUseCase } = makeSut();

        import.meta.jest
            .spyOn(updateUserUseCase, "execute")
            .mockRejectedValueOnce(new UserNotFoundError(faker.string.uuid()));

        const result = await sut.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });
});
