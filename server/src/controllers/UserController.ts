import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import Video from "../models/Video";

dotenv.config();

const googleClient = new OAuth2Client(process.env.VITE_CLIENT_ID!);

export const googleSignin = async (req: Request, res: Response) => {
  console.log("Google Sign-In Request Received!");

  const { idToken } = req.body;
  console.log("Received ID Token:", idToken);

  if (!idToken) {
    return res.status(400).json({ message: "Token ID is required" });
  }

  try {
    console.log("Client-id:", process.env.VITE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.VITE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    console.log("Google Payload:", payload);

    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email: email});
    console.log("User Found in DB:", user);

    if (!user) {
      user = new User({
        username: name,
        email,
        picture,
        provider: "google",
        providerId: sub,
      });
      await user.save();
      console.log("New User Created:", user);
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.VITE_JWT_KEY!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { username: user.username, email: user.email, picture: user.picture } });
  } catch (err) {
    console.error("❌ Error during Google Sign-In:", err);
    res.status(500).json({ message: "Error signing in with Google", error: err });
  }
};

const GITHUB_REDIRECT_URI = process.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/comments";

export const githubSignin = async (req: Request, res: Response) => {

  

  const { code } = req.body;
  if (!code) return res.status(400).json({ message: "GitHub code is required" });

  try {
    console.log("GitHub OAuth Request Data:", {
      client_id: process.env.VITE_GITHUB_CLIENT_ID,
      client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.VITE_GITHUB_REDIRECT_URI,
    });
    
    // 🔹 Exchange code for access token
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET,
        code,
        //redirect_uri: process.env.VITE_GITHUB_REDIRECT_URI, // ✅ Ensure this is passed
      },
      { headers: { Accept: "application/json" } }
    );


    if (!response.data || response.data.error) {
      return res.status(400).json({ message: "GitHub authentication failed", error: response.data });
    }

    const { access_token } = response.data;
    if (!access_token) return res.status(400).json({ message: "GitHub access token not received" });

    // 🔹 Fetch GitHub User Info
    const userInfo = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, login, avatar_url } = userInfo.data;
    if (!id || !login) {
      return res.status(400).json({ message: "Invalid GitHub user data" });
    }

    // 🔹 Fetch User Email
    const emailResponse = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailResponse.data.find((email: any) => email.primary)?.email || "";

    // 🔹 Check if User Already Exists
    let user = await User.findOne({ email: primaryEmail });

    if (user) {
      // If user exists, update provider ID
      user.providerId = id;
      await user.save();
    } else {
      // If new user, create a new record
      user = new User({
        username: login,
        email: primaryEmail,
        picture: avatar_url,
        provider: "github",
        providerId: id,
      });
      await user.save();
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.VITE_JWT_KEY!, { expiresIn: "7d" });

    // 🔹 Set Cookie & Send Response
    //res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    
    
    return res.status(200).json({
      token,  // ✅ Now returning the token
      user: { username: user.username, email: user.email, picture: user.picture },
    });

  } catch (err: any) {
    console.error("❌ GitHub Sign-In Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "GitHub login failed", error: err.response?.data || err.message });
  }
};


export const getUserDetails = async (req: Request, res: Response) => {
  const token = req.cookies.token; // ✅ Read from cookies

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_KEY!) as { userId: string };

    // ✅ Fetch user details from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user, email: user.email });
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  res.status(200).json({ message: "Logged out successfully" });
};



export const searchVideos = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Search query is required" });

  try {
    const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=100&q=${query}&key=${API_KEY}`
    );

    const videos = response.data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    return res.json({ videos });
  } catch (error) {
    console.error("YouTube Search Error:", error);
    return res.status(500).json({ message: "Failed to fetch videos" });
  }
};


export const getVideoComments = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  if (!videoId) return res.status(400).json({ message: "Video ID is required" });

  try {
    const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${API_KEY}`
    );

    let comments = response.data.items.map((item: any) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      profileImage: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      likeCounts: item.snippet.topLevelComment.snippet.likeCount,
      totalReplyCount: item.snippet.totalReplyCount,
    }));

    // Filtering out unwanted comments
    comments = comments.filter((comment:any) => {
      // Remove comments that are only emojis
      const onlyEmojis = /^([\p{Emoji_Presentation}\s]+)$/u.test(comment.text);
      
      // Remove comments that contain only a timestamp link
      const onlyTimestamp = /<a href=.*>\d{1,2}:\d{2}<\/a>/.test(comment.text);

      return !onlyEmojis && !onlyTimestamp;
    });

    // Sorting: First by totalReplyCount, then by likeCounts (both in descending order)
    comments.sort((a:any, b:any) => {
      if (b.totalReplyCount !== a.totalReplyCount) {
        return b.totalReplyCount - a.totalReplyCount; // Sort by replies first
      }
      return b.likeCounts - a.likeCounts; // If replies are the same, sort by likes
    });

    console.log("Filtered & Sorted Comments:", comments);

    return res.json({ comments });
  } catch (error) {
    console.error("YouTube Comments Error:", error);
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};


export const addComment = async (req: Request, res: Response) => {
  console.log("Received Headers:", req.headers);

  const userId = req.headers["user-id"];
  const videoId = req.headers["video-id"];

  if (!userId) {
    console.log("⚠️ Missing user ID in headers!");
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (!videoId) {
    console.log("⚠️ Missing video ID in headers!");
    return res.status(400).json({ message: "Video ID is required" });
  }

  try {
    // Ensure videoId is a string
    const normalizedVideoId = Array.isArray(videoId) ? videoId[0] : videoId;

    const video = await Video.findOne({ url: new RegExp(normalizedVideoId, "i") });

    if (!video) {
      console.log("⚠️ Video not found with videoId:", normalizedVideoId);
      return res.status(404).json({ message: "Video not found" });
    }

    const newComment = {
      user: userId,
      text: req.body.text,
      createdAt: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getVideoById = async (req: Request, res: Response) => {
  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ message: "Video ID is required" });

  try {
    const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoData = response.data.items[0].snippet;
    const video = {
      videoId,
      title: videoData.title,
      thumbnail: videoData.thumbnails.medium.url,
      channel: videoData.channelTitle,
    };

    res.json({ video });
  } catch (error) {
    console.error("Error fetching video details:", error);
    res.status(500).json({ message: "Failed to fetch video details" });
  }
};
