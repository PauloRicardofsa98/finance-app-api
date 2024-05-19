import { notFound } from "../helpers/http.js";

export const userNotFoundResponse = () =>
    notFound({ message: "User not found." });
