import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
    requiredFieldsIsMissingResponse,
} from "../helpers/index.js";
import { EmailAlreadyInUseError } from "../../errors/user.js";

export class CreateUserController {
    constructor(createUserCase) {
        this.createUserCase = createUserCase;
    }

    async execute(request) {
        try {
            const params = request.body;

            const requiredFields = [
                "first_name",
                "last_name",
                "email",
                "password",
            ];

            const { ok, missingField } = validateRequiredFields(
                params,
                requiredFields,
            );
            if (!ok) {
                return requiredFieldsIsMissingResponse(missingField);
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);
            if (!passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);
            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse();
            }

            const user = await this.createUserCase.execute(params);

            return created(user);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.error(error);
            return serverError();
        }
    }
}
