import validator from "validator";
import { z } from "zod";

export const createTransactionSchema = z.object({
    userId: z
        .string({
            required_error: "userId is required",
        })
        .uuid({
            message: "userId must be a valid UUID.",
        }),
    name: z
        .string({
            required_error: "Name is required",
        })
        .trim()
        .min(1, {
            message: "Name is required.",
        }),
    date: z
        .string({ required_error: "Date is required." })
        .datetime({ message: "Date must a valid date" }),
    type: z.enum(["EARNING", "EXPENSE", "INVESTMENT"], {
        errorMap: () => ({
            message: "Type must be EARNING, EXPENSE or INVESTMENT.",
        }),
    }),
    amount: z
        .number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
        })
        .min(1, {
            message: "Amount must be greater than 0.",
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_decimal: true,
                decimal_separator: ".",
            }),
        ),
});

export const updateTransactionSchema = createTransactionSchema
    .omit({ userId: true })
    .partial();

export const getTransactionsByUserIdSchema = z.object({
    userId: z
        .string({
            required_error: "userId is required",
        })
        .uuid({
            message: "userId must be a valid UUID.",
        }),
    from: z.string().date(),
    to: z.string().date(),
});
