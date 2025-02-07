import { faker } from "@faker-js/faker";

export const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.string.alphanumeric(10),
    date: faker.date.anytime().toISOString(),
    type: "EXPENSE",
    amount: Number(faker.finance.amount()),
};
