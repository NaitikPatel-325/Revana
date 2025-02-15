import { Schema, model } from "mongoose";

interface IUserSchema {
  username: string;
  email: string;
  picture?: string;
  provider: "google" | "github";
  providerId: string;
}

const UserSchema = new Schema<IUserSchema>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    picture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true, // Ensures one user per provider ID
    },
  },
  { timestamps: true }
);

export const User = model<IUserSchema>("User", UserSchema);
