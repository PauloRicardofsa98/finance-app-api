import validator from "validator";
import { badRequest } from "./http";

export const checkIfAmountIsValid = (amount) => {
    return validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        allow_decimal: false,
        decimal_separator: ".",
    });
};

export const checkIfTypeIsValid = (type) => {
    return ["EARNING", "EXPENSE", "INVESTIMENT"].includes(type);
};

export const invalidAmountResponse = () => {
    return badRequest({
        message: "the amount must be a valid currency",
    });
};

export const invalidTypeResponse = () => {
    return badRequest({
        message: "The type must be EARNING, EXPENSE, INVESTIMENT.",
    });
};
