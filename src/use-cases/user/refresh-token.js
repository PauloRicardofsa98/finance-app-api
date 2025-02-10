import { UnauthorizedError } from "../../errors/user";

export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter;
        this.tokenVerifierAdapter = tokenVerifierAdapter;
    }

    execute(refreshToken) {
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            );
            if (!decodedToken) {
                throw new UnauthorizedError();
            }
            return this.tokensGeneratorAdapter.execute(decodedToken.userId);
        } catch (err) {
            console.log(err);
            throw new UnauthorizedError();
        }
    }
}
