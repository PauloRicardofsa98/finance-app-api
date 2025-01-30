import { IdGeneratorAdapter } from "./id-generator";
import validator from "validator";

describe("IdGeneratorAdapter", () => {
    it("should return a random id", async () => {
        const sut = new IdGeneratorAdapter();

        const result = await sut.execute();
        expect(result).not.toBeNull();
        expect(typeof result).toBe("string");
        expect(validator.isUUID(result)).toBe(true);
    });
});
