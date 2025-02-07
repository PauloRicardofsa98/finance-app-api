import { InvalidPasswordError, UserNotFoundError } from "../../errors";
import { user } from "../../tests";
import { LoginUserController } from "./login-user";

describe("Login User Controller", () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: "any_token",
                    refreshToken: "any_refresh_token",
                },
            };
        }
    }

    const makeSut = () => {
        const loginUserUseCaseStub = new LoginUserUseCaseStub();
        const sut = new LoginUserController(loginUserUseCaseStub);
        return { sut, loginUserUseCaseStub };
    };

    const httpRequest = {
        body: {
            email: user.email,
            password: user.password,
        },
    };

    it("should return 200 with getting user by id", async () => {
        //arrange
        const { sut } = makeSut();

        // act
        const response = await sut.execute(httpRequest);

        // assert
        expect(response.statusCode).toBe(200);
        expect(response.body.tokens).toEqual({
            accessToken: "any_token",
            refreshToken: "any_refresh_token",
        });
    });

    it("should return 401 if password is invalid", async () => {
        //arrange
        const { sut, loginUserUseCaseStub } = makeSut();
        import.meta.jest
            .spyOn(loginUserUseCaseStub, "execute")
            .mockRejectedValueOnce(new InvalidPasswordError());

        // act
        const result = await sut.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(401);
    });

    it("should return 404 if user not found", async () => {
        //arrange
        const { sut, loginUserUseCaseStub } = makeSut();
        import.meta.jest
            .spyOn(loginUserUseCaseStub, "execute")
            .mockRejectedValueOnce(new UserNotFoundError());

        // act
        const result = await sut.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(404);
    });
});
