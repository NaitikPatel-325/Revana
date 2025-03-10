import { Schema, model } from "mongoose";

interface IFashionSchema {
  asin: string;
  name: string;
  reviews: {
    rating: number;
    review: string;
    date: string;
  }[];
}

const FashionSchema = new Schema<IFashionSchema>(
  {
    asin: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: false,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          required: false,
          trim: true,
        },
        date: {
          type: String,
          required: false,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Fashion = model<IFashionSchema>("Fashion", FashionSchema);
