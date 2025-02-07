import { PasswordHasherAdapter } from "./password-hasher";
import { faker } from "@faker-js/faker";

describe("PasswordComparatorAdapter", () => {
    it("should return a comparator between password and hashed password", async () => {
        const sut = new PasswordHasherAdapter();
        const password = faker.internet.password();
        const hashedPassword = await sut.execute(password);

        const result = await sut.execute(password, hashedPassword);

        expect(result).not.toBeNull();
    });
});
