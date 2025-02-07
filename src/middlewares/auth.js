import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split("Bearer ")[1];

        if (!accessToken) {
            console.log("token not found");
            return res.status(401).send({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        );

        if (!decodedToken) {
            console.log("token not valid");
            return res.status(401).send({ message: "Unauthorized" });
        }

        req.userId = decodedToken.userId;

        next();
    } catch {
        return res.status(401).send({ message: "Unauthorized" });
    }
};
