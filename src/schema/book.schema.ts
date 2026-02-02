import { Schema, Document, model } from "mongoose";

export interface BookDocument extends Document {
  title: string;
  author: string;
  publishedYear: number;
  genre?: string;
  price?: number;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<BookDocument>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publishedYear: { type: Number, required: true },
    genre: { type: String, required: false, trim: true },
    price: { type: Number, required: false, min: 0 },
    inStock: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

export const BookModel = model<BookDocument>("Book", BookSchema);


