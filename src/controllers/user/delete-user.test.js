import { faker } from "@faker-js/faker";
import { DeleteUserController } from "./delete-user";

describe("Delete user Controller", () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return {
                uuid: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            };
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub();
        const sut = new DeleteUserController(deleteUserUseCase);

        return { deleteUserUseCase, sut };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it("should return 200 when deleting a user successfully", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(200);
    });

    it("should return 400 when deleting a user with invalid userId", async () => {
        //arrange
        const { sut } = makeSut();

        //act
        const result = await sut.execute({ params: { userId: "invalid_id" } });

        //assert
        expect(result.statusCode).toBe(400);
    });

    it("should return 404 when deleting a user that does not exist", async () => {
        //arrange
        const { sut, deleteUserUseCase } = makeSut();
        jest.spyOn(deleteUserUseCase, "execute").mockResolvedValueOnce(null);

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(404);
    });

    it("should return 500 when an error occurs", async () => {
        //arrange
        const { sut, deleteUserUseCase } = makeSut();
        jest.spyOn(deleteUserUseCase, "execute").mockRejectedValueOnce(
            new Error()
        );

        //act
        const result = await sut.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(500);
    });
});
