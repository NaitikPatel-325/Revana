import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User"; // Assuming User model exists
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

dotenv.config();

// Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

// 1. Google Sign-In
export const googleSignin = async (req: Request, res: Response) => {
  const { tokenId } = req.body; // The ID token received from the frontend

  if (!tokenId) {
    return res.status(400).json({ message: "Token ID is required" });
  }

  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID!, // Audience is your client ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { sub, email, name, picture } = payload;

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If not, create a new user
      user = new User({
        username: name,
        email,
        picture,
      });
      await user.save();
    }

    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { username: user.username, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing in with Google" });
  }
};

// 2. GitHub Sign-In
export const githubSignin = async (req: Request, res: Response) => {
  const { code } = req.body; // The code received from GitHub OAuth flow

  if (!code) {
    return res.status(400).json({ message: "GitHub code is required" });
  }

  try {
    // Exchange the GitHub code for an access token
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = response.data;

    if (!access_token) {
      return res.status(400).json({ message: "GitHub authentication failed" });
    }

    // Use the access token to get user information from GitHub
    const userInfo = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { login, email, avatar_url } = userInfo.data;

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If not, create a new user
      user = new User({
        username: login,
        email,
        picture: avatar_url,
      });
      await user.save();
    }

    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { username: user.username, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error signing in with GitHub" });
  }
};
