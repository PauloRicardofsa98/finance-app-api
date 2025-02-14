import { faker } from "@faker-js/faker";

export const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
};

export const userBalance = {
    earning: faker.number.int(),
    expenses: faker.number.int(),
    investments: faker.number.int(),
    balance: faker.number.int(),
};
