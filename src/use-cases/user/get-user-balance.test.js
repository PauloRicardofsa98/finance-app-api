import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "./get-user-balance";
import { UserNotFoundError } from "../../errors/user";

describe("GetUserBalance UseCase", () => {
    const balance = {
        earning: faker.number.int(),
        expenses: faker.number.int(),
        investments: faker.number.int(),
        balance: faker.number.int(),
    };

    class GetUserBalanceRepositoryStub {
        async execute() {
            return balance;
        }
    }

    class getUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new getUserByIdRepositoryStub();
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository
        );
        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    it("should successfully get user balance", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid());

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(balance);
    });

    it("should throw UserNotFoundError when user is not found", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        getUserByIdRepository.execute = jest.fn().mockResolvedValue(null);
        const uuid = faker.string.uuid();
        // Act
        const promise = sut.execute(uuid);

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(uuid));
    });

    it("should call GetUserByIdRepository with correct values", async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            "execute"
        );
        const uuid = faker.string.uuid();

        // Act
        await sut.execute(uuid);

        // Assert
        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(uuid);
    });
});
