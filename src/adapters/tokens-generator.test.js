import { TokensGeneratorAdapter } from "./tokens-generator";
import { faker } from "@faker-js/faker";

describe("TokensGeneratorAdapter", () => {
    it("should return a pair of tokens", () => {
        const sut = new TokensGeneratorAdapter();
        const userId = faker.string.uuid();

        const result = sut.execute(userId);

        expect(result).toHaveProperty("accessToken");
        expect(result).toHaveProperty("refreshToken");
    });
});
