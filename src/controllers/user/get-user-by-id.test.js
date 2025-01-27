import { user } from "../../tests";
import { GetUserByIdController } from "./get-user-by-id";
import { faker } from "@faker-js/faker";

describe("Get User By Id Controller", () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub();
        const sut = new GetUserByIdController(getUserByIdUseCase);

        return { sut, getUserByIdUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it("should return 200 with getting user by id", async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(200);
    });

    it("should return 400 with invalid id", async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute({
            params: { userId: "invalid_id" },
        });

        // assert
        expect(response.statusCode).toBe(400);
    });

    it("should return 404 with user not found", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        jest.spyOn(getUserByIdUseCase, "execute").mockResolvedValue(null);

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(404);
    });

    it("should return 500 with GetUserByIdUseCase throws an exception", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        jest.spyOn(getUserByIdUseCase, "execute").mockRejectedValueOnce(
            new Error()
        );

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(500);
    });

    it("should call GetUserByIdUseCase with correct values", async () => {
        //arrange
        const { sut, getUserByIdUseCase } = makeSut();
        const spy = jest.spyOn(getUserByIdUseCase, "execute");

        // act
        await sut.execute(httpRequest);

        // assert
        expect(spy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
