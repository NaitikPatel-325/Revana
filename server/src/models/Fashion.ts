import { Schema, model } from "mongoose";

interface IFashionSchema {
  name: string;
  images: string;
  reviews: {
    review_rating: number;
    review_title: string;
    review_body: string;
  }[];
}

const FashionSchema = new Schema<IFashionSchema>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    images: {
      type: String,
      required: true,
    },
    reviews: [
      {
        review_rating: {
          type: Number,
          required: false,
          min: 1,
          max: 5,
        },
        review_title: {
          type: String,
          required: false,
          trim: true,
        },
        review_body: {
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
