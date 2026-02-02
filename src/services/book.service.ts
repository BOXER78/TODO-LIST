import { BookDocument } from "../schema/book.schema";
import { BookQueryOptions, BookRepository } from "../repositories/book.repository";

export interface CreateBookDTO {
  title: string;
  author: string;
  publishedYear: number;
  genre?: string;
  price?: number;
  inStock?: boolean;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  publishedYear?: number;
  genre?: string;
  price?: number;
  inStock?: boolean;
}

export class BookService {
  private repository: BookRepository;

  constructor(repository = new BookRepository()) {
    this.repository = repository;
  }

  async createBook(data: CreateBookDTO): Promise<BookDocument> {
    this.validateCreateData(data);
    return await this.repository.create(data);
  }

  async getBookById(id: string): Promise<BookDocument | null> {
    return await this.repository.findById(id);
  }

  async listBooks(query: BookQueryOptions) {
    return await this.repository.findAll(query);
  }

  async updateBook(id: string, data: UpdateBookDTO) {
    this.validateUpdateData(data);
    return await this.repository.update(id, data);
  }

  async deleteBook(id: string) {
    return await this.repository.delete(id);
  }

  private validateCreateData(data: CreateBookDTO) {
    if (!data.title || !data.author) {
      throw new Error("title and author are required");
    }

    if (data.publishedYear === undefined || data.publishedYear === null) {
      throw new Error("publishedYear is required");
    }

    if (typeof data.publishedYear !== "number") {
      throw new Error("publishedYear must be a number");
    }

    if (data.price !== undefined && typeof data.price !== "number") {
      throw new Error("price must be a number");
    }
  }

  private validateUpdateData(data: UpdateBookDTO) {
    if (
      data.publishedYear !== undefined &&
      typeof data.publishedYear !== "number"
    ) {
      throw new Error("publishedYear must be a number");
    }

    if (data.price !== undefined && typeof data.price !== "number") {
      throw new Error("price must be a number");
    }
  }
}


