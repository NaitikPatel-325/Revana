import mongoose, { Document, Schema } from "mongoose";

// Define Food Interface
interface IFood extends Document {
  item: string;
  category: string;
  price: number;
  picture?: string;
  comments: {
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

// Define Food Schema
const FoodSchema = new Schema<IFood>(
  {
    item: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Export Food Model
const Food = mongoose.model<IFood>("Food", FoodSchema);
export default Food;
