import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "./update-user";

describe("UpdateUser UseCase", () => {
    const user = {
        id: faker.string.uuid(),
        uuid: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        execute() {
            return "hashed_password";
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const updateUserRepository = new UpdateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter
        );
        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        };
    };

    it("should successfully update a user (without email and password)", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(faker.string.uuid(), {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        });

        // Assert
        expect(response).toBeTruthy();
        expect(response).toEqual(user);
    });
});
