import mongoose from "mongoose";
import { BookDocument, BookModel } from "../schema/book.schema";

export interface BookQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  genre?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export class BookRepository {
  async create(data: Partial<BookDocument>): Promise<BookDocument> {
    const book = new BookModel(data);
    return await book.save();
  }

  async findById(id: string): Promise<BookDocument | null> {
    return await BookModel.findById(id);
  }

  async findAll(query: BookQueryOptions) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      genre,
      inStock,
      minPrice,
      maxPrice,
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    if (typeof inStock === "boolean") {
      filter.inStock = inStock;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      BookModel.find(filter).sort(sort).skip(skip).limit(limit),
      BookModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    data: Partial<BookDocument>
  ): Promise<BookDocument | null> {
    return await BookModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<BookDocument | null> {
    return await BookModel.findByIdAndDelete(id);
  }
}


