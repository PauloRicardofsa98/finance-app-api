import { UnauthorizedError } from "../../errors/user";
import { RefreshTokenUseCase } from "./refresh-token";

describe("Refresh Token", () => {
    class TokenVerifierAdapterStub {
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
        const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();
        const tokenVerifierAdapterStub = new TokenVerifierAdapterStub();

        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapterStub,
            tokenVerifierAdapterStub,
        );

        return { sut, tokensGeneratorAdapterStub, tokenVerifierAdapterStub };
    };

    it("should return new token", () => {
        const { sut } = makeSut();

        const response = sut.execute("any_refresh_token");

        expect(response).toEqual({
            accessToken: "any_access_token",
            refreshToken: "any_refresh_token",
        });
    });

    it("should throw if tokenVerifierAdapter throws", () => {
        const { sut, tokenVerifierAdapterStub } = makeSut();

        import.meta.jest
            .spyOn(tokenVerifierAdapterStub, "execute")
            .mockImplementationOnce(() => {
                throw new UnauthorizedError();
            });

        expect(() => sut.execute("any_refresh_token")).toThrow(
            new UnauthorizedError(),
        );
    });
});
