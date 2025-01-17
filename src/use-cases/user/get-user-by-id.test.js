import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "./get-user-by-id";

describe("GetUserById UseCase", () => {
    const user = {
        id: faker.string.uuid(),
        uuid: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);
        return {
            sut,
            getUserByIdRepository,
        };
    };

    it("should successfully get a user by id", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid());

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(user);
    });
});
