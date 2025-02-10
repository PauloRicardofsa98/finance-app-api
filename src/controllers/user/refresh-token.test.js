import { UnauthorizedError } from "../../errors";
import { RefreshTokenController } from "./refresh-token";

describe("RefreshTokenController", () => {
    class RefreshTokenUseCaseStub {
        execute() {
            return {
                accessToken: "valid_access_token",
                refreshToken: "valid_refresh_token",
            };
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub();
        const sut = new RefreshTokenController(refreshTokenUseCase);

        return { sut, refreshTokenUseCase };
    };

    it("should return 200 with valid refresh token", async () => {
        const { sut } = makeSut();
        const response = await sut.execute({
            body: { refreshToken: "valid_refresh_token" },
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBe("valid_access_token");
        expect(response.body.refreshToken).toBe("valid_refresh_token");
    });

    it("should return 400 if refresh token is not valid", async () => {
        const { sut } = makeSut();
        const response = await sut.execute({ body: { refreshToken: 2 } });

        expect(response.statusCode).toBe(400);
    });

    it("should return 401 if use case throws UnauthorizedError", async () => {
        const { sut, refreshTokenUseCase } = makeSut();

        import.meta.jest
            .spyOn(refreshTokenUseCase, "execute")
            .mockImplementation(() => {
                throw new UnauthorizedError();
            });

        const response = await sut.execute({ body: { refreshToken: "any" } });

        expect(response.statusCode).toBe(401);
    });
});
