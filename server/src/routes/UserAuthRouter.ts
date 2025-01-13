import express from "express";
import { googleSignin, githubSignin } from "../controllers/UserController";

export const UserAuthRouter = express.Router();

// Correct the routes by adding leading slashes
UserAuthRouter.post("/googleSignin", googleSignin); // Google sign-in route
UserAuthRouter.post("/githubSignin", githubSignin); // GitHub sign-in route
