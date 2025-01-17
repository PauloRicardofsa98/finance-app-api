import { CreateUserUseCase } from "./create-user";
import { faker } from "@faker-js/faker";

describe("Create User Use Case", () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        execute() {
            return "hashed_password";
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return "user_id";
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
        const createUserRepositoryStub = new CreateUserRepositoryStub();
        const passwordHasherAdapterStub = new PasswordHasherAdapterStub();
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub();
        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub
        );
        return {
            sut,
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        };
    };

    it("should successfully create a user", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });

        // Assert
        expect(response).toBeTruthy();
    });
});
