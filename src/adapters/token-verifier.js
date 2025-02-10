import jwt from "jsonwebtoken";

export class TokenVerifierAdapter {
    execute(token, secret) {
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
}
