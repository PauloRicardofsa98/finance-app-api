import { InvalidPasswordError, UserNotFoundError } from "../../errors";
import { user } from "../../tests";
import { LoginUserUseCase } from "./login-user";

describe("Login User UseCase", () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user;
        }
    }
    class PasswordComparatorAdapterStub {
        execute() {
            return true;
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: "any_access_token",
                refreshToken: "any_refresh_token",
            };
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const passwordComparator = new PasswordComparatorAdapterStub();
        const tokensGenerator = new TokensGeneratorAdapterStub();

        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparator,
            tokensGenerator,
        );
        return {
            sut,
            getUserByEmailRepository,
            passwordComparator,
            tokensGenerator,
        };
    };

    it("should throw UserNotFoundError when user is not found", async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        import.meta.jest
            .spyOn(getUserByEmailRepository, "execute")
            .mockResolvedValueOnce(null);

        // Act
        const promise = sut.execute("any_email", "any_password");

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError());
    });

    it("should throw InvalidPasswordError when password is invalid", async () => {
        // Arrange
        const { sut, passwordComparator } = makeSut();
        import.meta.jest
            .spyOn(passwordComparator, "execute")
            .mockReturnValueOnce(false);

        // Act
        const promise = sut.execute("password", "hashed_password");

        // Assert
        await expect(promise).rejects.toThrow(new InvalidPasswordError());
    });

    it("should return user with tokens when login is successful", async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute("any_email", "any_password");

        // Assert
        expect(result).toEqual({
            ...user,
            tokens: {
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            },
        });
    });
});
