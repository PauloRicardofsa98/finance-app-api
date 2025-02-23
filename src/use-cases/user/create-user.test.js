import { EmailAlreadyInUseError } from "../../errors/user";
import { CreateUserUseCase } from "./create-user";
import { user as fixtureUser } from "../../tests";

describe("Create User Use Case", () => {
    const user = { ...fixtureUser, id: undefined };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return "hashed_password";
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return "userId";
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: "access_token",
                refreshToken: "refresh_token",
            };
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const createUserRepository = new CreateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
        );
        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        };
    };

    it("should successfully create a user", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(user);

        // Assert
        expect(response).toBeTruthy();
        expect(response.tokens.accessToken).toBeDefined();
        expect(response.tokens.refreshToken).toBeDefined();
    });

    it("throw an EmailAlreadyInUseError if the email is already in use", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockResolvedValueOnce(user);

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        );
    });

    it("should call IdGeneratorAdapter and PasswordHasherAdapter to generate a random id and hash the password", async () => {
        // Arrange
        const {
            sut,
            passwordHasherAdapter,
            idGeneratorAdapter,
            createUserRepository,
        } = makeSut();
        const idGeneratorAdapterSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            "execute",
        );
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            "execute",
        );
        const passwordHasherAdapterSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            "execute",
        );

        // Act
        await sut.execute(user);

        // Assert
        expect(idGeneratorAdapterSpy).toHaveBeenCalled();
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(user.password);
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: "hashed_password",
            id: "userId",
        });
    });

    it("should throw if GetUserByEmailRepository throws", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if IdGeneratorAdapter throws", async () => {
        // Arrange
        const { sut, idGeneratorAdapter } = makeSut();
        import.meta.jest
            .spyOn(idGeneratorAdapter, "execute")
            .mockImplementationOnce(() => {
                throw new Error();
            });

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if PasswordHasherAdapter throws", async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();
        import.meta.jest
            .spyOn(passwordHasherAdapter, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow();
    });

    it("should throw if CreateUserRepository throws", async () => {
        // Arrange
        const { sut, createUserRepository } = makeSut();
        import.meta.jest
            .spyOn(createUserRepository, "execute")
            .mockRejectedValueOnce(new Error());

        // Act
        const promise = sut.execute(user);

        // Assert
        await expect(promise).rejects.toThrow();
    });
});
