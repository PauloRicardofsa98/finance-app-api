import { CreateUserController } from "./create-user";

describe("Create user Controller", () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    it("should return 201 when creating a user successfully", async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: "John",
                last_name: "Doe",
                email: "jhon_doe@test.com",
                password: "123456",
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(201);
        expect(result.body).not.toBeNull();
        expect(result.body).not.toBeUndefined();
    });

    it('should return 400 when "first_name" is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                last_name: "Doe",
                email: "test@test.com",
                password: "123456",
            },
        };

        //act
        const result = await createUserController.execute(httpRequest);

        //assert
        expect(result.statusCode).toBe(400);
    });
});
