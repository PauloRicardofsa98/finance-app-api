import "dotenv/config.js";
import { app } from "./src/app.cjs";

app.listen(process.env.PORT, () =>
    console.log(`listenning on port ${process.env.PORT}`)
);
