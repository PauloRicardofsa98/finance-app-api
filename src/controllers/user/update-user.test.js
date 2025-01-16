import { faker } from "@faker-js/faker";
import { UpdateUserController } from "./update-user";

describe("Update User Controller", () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
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
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
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
});
