import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { UserAuthRouter } from "./src/routes/UserAuthRouter"; // Import the corrected router
import cookieParser from "cookie-parser";
import { dbConnect } from "./src/lib/dbConnect";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // CORS setup for frontend
config();

app.use("/user", UserAuthRouter); // Register the user routes under the /user prefix


dbConnect();

app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});
