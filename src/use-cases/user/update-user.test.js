import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "./update-user";
import { EmailAlreadyInUseError } from "../../errors/user.js";
import { user } from "../../tests";

describe("UpdateUser UseCase", () => {
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
        async execute() {
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
            passwordHasherAdapter,
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

    it("should successfully update a user (with email)", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        const getUserByEmailRepositorySpy = import.meta.jest.spyOn(
            getUserByEmailRepository,
            "execute",
        );

        const email = faker.internet.email();

        // Act
        const response = await sut.execute(faker.string.uuid(), {
            email,
        });

        // Assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
        expect(response).toBe(user);
    });

    it("should successfully update a user (with password)", async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();
        const passwordHasherAdapterSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            "execute",
        );

        const password = faker.internet.password();

        // Act
        const response = await sut.execute(faker.string.uuid(), {
            password,
        });

        // Assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
        expect(response).toBe(user);
    });

    it("should throw an error if email is already in use", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockResolvedValueOnce({
                user,
            });
        const email = faker.internet.email();

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            email,
        });

        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(email),
        );
    });

    it("should call UpdateUserRepository with correct params", async () => {
        // Arrange
        const { sut, updateUserRepository } = makeSut();
        const updateUserRepositorySpy = import.meta.jest.spyOn(
            updateUserRepository,
            "execute",
        );
        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        };
        // Act
        await sut.execute(user.id, updateUserParams);

        // Assert
        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: "hashed_password",
        });
    });

    it("should throw if GetUserByEmailRepository throws", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        });

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if PasswordHasherAdapter throws", async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();
        import.meta.jest
            .spyOn(passwordHasherAdapter, "execute")
            .mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        });

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if UpdateUserRepository throws", async () => {
        // Arrange
        const { sut, updateUserRepository } = makeSut();
        import.meta.jest
            .spyOn(updateUserRepository, "execute")
            .mockRejectedValue(new Error());

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });

        // Assert
        await expect(promise).rejects.toThrow();
    });
});
