import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import Video from "../models/Video";
import { generateCommentsDescription } from "./Prompt";

const GITHUB_REDIRECT_URI = process.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/comments";

dotenv.config();

interface SentimentCountType{
  good:number,
  neutral:number,
  bad:number
}

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


export const getUserDetails = async (req: Request, res: Response) => {
  const token = req.cookies.token;

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
  const { userEmail } = req.query;

  if (!videoId) return res.status(400).json({ message: "Video ID is required" });

  try {
    let userComments: any[] = [];
    if (userEmail) {
      const user = await User.findOne({ email: userEmail.toString().toLowerCase() });
      if (user) {
        const video = await Video.findOne({ url: new RegExp(videoId, "i") }).populate({
          path: "comments.user",
          select: "email picture",
        });

        if (video) {
          userComments = video.comments
            .filter((comment) => comment.user && (comment.user as any).email === userEmail)
            .map((comment) => ({
              author: (comment.user as any).email,
              text: comment.text,
              profileImage: (comment.user as any).picture || "/default-avatar.png",
              sentiment: (comment as any).sentiment || 1, 
              sentimentText: comment.text,
            }));
        }
      }
    }

    const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
    const ytResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${API_KEY}`
    );

    let ytComments = ytResponse.data.items.map((item: any) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      profileImage: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      likeCounts: item.snippet.topLevelComment.snippet.likeCount,
      totalReplyCount: item.snippet.totalReplyCount,
    }));

    if (!ytComments.length) return res.json({ comments: userComments, sentimentCounts: { good: 0, neutral: 0, bad: 0 } });

    const flaskResponse = await axios.post("http://127.0.0.1:5000/api/v1/youtube-comments", {
      comments: ytComments.map((comment: any) => comment.text),
    });

    if (!flaskResponse.data.comments) {
      return res.status(500).json({ message: "Error in sentiment analysis" });
    }

    const ytCommentsWithSentiment = ytComments.map((comment: any, index: number) => ({
      ...comment,
      sentiment: flaskResponse.data.comments[index].Sentiment,
      sentimentText: flaskResponse.data.comments[index].Comment,
    }));

    const allComments = [...userComments, ...ytCommentsWithSentiment];

    const sentimentCounts = {
      good: allComments.filter((comment: any) => comment.sentiment === 2).length,
      neutral: allComments.filter((comment: any) => comment.sentiment === 1).length,
      bad: allComments.filter((comment: any) => comment.sentiment === 0).length,
    };


    const positiveComments = allComments.filter(
      (comment: any) => comment.sentiment === 2 || comment.sentiment === 1
    );

    const negativeComments = allComments.filter(
      (comment: any) => comment.sentiment === 0
    );

    const descriptions = await generateCommentsDescription(
      positiveComments,
      negativeComments
    );


    console.log(descriptions);

    res.json({ comments: allComments, sentimentCounts, descriptions });
  } catch (error) {
    // console.error("YouTube Comments Error:");
    return res.status(500).json({ message: "Failed to fetch comments" });
  }
};


// export const getVideoComments = async (req: Request, res: Response) => {
//   const { videoId } = req.params;

//   if (!videoId) return res.status(400).json({ message: "Video ID is required" });

//   console.log(videoId);

//   try {
//     const API_KEY = process.env.VITE_YOUTUBE_API_KEY;
//     const response = await axios.get(
//       `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=400&key=${API_KEY}`
//     );

//     let comments = response.data.items.map((item: any) => ({
//       author: item.snippet.topLevelComment.snippet.authorDisplayName,
//       text: item.snippet.topLevelComment.snippet.textDisplay,
//       profileImage: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
//       likeCounts: item.snippet.topLevelComment.snippet.likeCount,
//       totalReplyCount: item.snippet.totalReplyCount,
//     }));

//     // Filtering out unwanted comments
//     comments = comments.filter((comment: any) => {
//       // Remove comments that are only emojis
//       const containsEmoji = /[\p{Emoji_Presentation}\p{Emoji}\u2000-\u3300]/gu.test(comment.text);
      
//       // Remove comments that are only a timestamp link (optional)
//       const onlyTimestamp = /<a href=.*>\d{1,2}:\d{2}<\/a>/.test(comment.text);

//       // Keep comments that don't contain emojis or timestamps
//       return !containsEmoji && !onlyTimestamp;
//     });

//     // Sorting: First by totalReplyCount, then by likeCounts (both in descending order)
//     comments.sort((a:any, b:any) => {
//       if (b.totalReplyCount !== a.totalReplyCount) {
//         return b.totalReplyCount - a.totalReplyCount; // Sort by replies first
//       }
//       return b.likeCounts - a.likeCounts; // If replies are the same, sort by likes
//     });


//     console.log("Filtered & Sorted Comments:", comments);
//     // let com = comments.text;
//     // const comment = await axios.post("http://127.0.0.1:5000/api/v1/youtube-comments", { com }); //flask Api

//     // console.log("Flask API Response:", comment.data);
//     // console.log("Comment:", comment.config.data);

//     // return res.json({ comment: comment.config.data });

//     // Extract the comments' text for sentiment analysis
//     const commentTexts = comments.map((comments: { text: any; }) => comments.text);

//     console.log("Comments Text   : ",commentTexts);

//     const commentsData = {
//       comments: commentTexts
//     };

//     console.log("Comments Data   : ",commentsData);

//     // Call the sentiment analysis API
//     const sentimentResponse = await axios.post("http://127.0.0.1:5000/api/v1/youtube-comments", { commentsData });

//     if (!sentimentResponse.data.comments) {
//       return res.status(500).json({ message: "Error in sentiment analysis" });
//     }

//     // Combine the sentiment data with the original comment data
//     const commentsWithSentiment = comments.map((comment:any, index:any) => {
//       const sentiment = sentimentResponse.data.comments[index];

//       return {
//         ...comment,
//         sentiment: sentiment.Sentiment, // Sentiment score from API
//         sentimentText: sentiment.Comment, // Processed comment text
//       };
//     });

//     // Send back the response with the combined data
//     res.json({ comments: commentsWithSentiment });
//   } catch (error) {
//     console.error("YouTube Comments Error:", error);
//     return res.status(500).json({ message: "Failed to fetch comments" });
//   }
// };

export const addComment = async (req: Request, res: Response) => {
  console.log("Received Headers:", req.headers);

  const userEmail = req.headers["user-id"] as string;
  const videoUrl = req.headers["video-id"] as string;
  const channel = req.headers["channel"] as string;
  const thumbnail = req.headers["thumbnail"] as string;
  const title = req.headers["title"] as string;
  const commentText = req.body.text;

  if (!userEmail) {
    console.log("⚠️ Missing user ID (email) in headers!");
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (!videoUrl) {
    console.log("⚠️ Missing video URL in headers!");
    return res.status(400).json({ message: "Video URL is required" });
  }

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`⚠️ No user found with email: ${userEmail}`);
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;

    let video = await Video.findOne({ url: new RegExp(videoUrl, "i") });

    if (!video) {
      console.log(`⚠️ Video not found, creating new entry for URL: ${videoUrl}`);

      video = new Video({
        title: title && title.trim() !== "" ? title : "Untitled Video",
        thumbnail: thumbnail,
        url: videoUrl,
        uploadedBy: userId,
        comments: [],
      });

      await video.save();
    }

    const newComment = {
      user: userId,
      text: commentText,
      createdAt: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error(" Error adding comment:", error);
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

