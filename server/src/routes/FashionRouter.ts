import express from "express";
import { getFashionData } from "../controllers/FashionController";

export const FashionRouter = express.Router();

FashionRouter.get("/fashion-details/:asin",getFashionData);