import express from "express";
import { googleSignin,getAmazonSentiment, getUserDetails, logout, searchVideos, getVideoComments, addComment, getVideoById } from "../controllers/UserController";

export const UserAuthRouter = express.Router();

UserAuthRouter.post("/googleSignin", googleSignin);
UserAuthRouter.get("/user-details",getUserDetails);
UserAuthRouter.post("/logout", logout);
// UserAuthRouter.get("/comments/videos/search",searchVideos);
// UserAuthRouter.get("/comments/videos/:videoId", getVideoComments);
// UserAuthRouter.post("/comments/videos/:videoId/add-comment", addComment);
UserAuthRouter.get("/amazon/:asin", getAmazonSentiment);
UserAuthRouter.get("/comments/videos/search", searchVideos);
UserAuthRouter.get("/comments/videos/:videoId", getVideoComments);
UserAuthRouter.post("/comments/videos/:videoId/add-comment", addComment);
UserAuthRouter.get("/comments/videos/get-video", getVideoById);
