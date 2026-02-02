import { Request, Response, NextFunction, Router } from "express";
import { BookService } from "../services/book.service";
import { BookQueryOptions } from "../repositories/book.repository";

export class BookController {
  public router: Router;
  private service: BookService;

  constructor(service = new BookService()) {
    this.router = Router();
    this.service = service;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.createBook);
    this.router.get("/", this.listBooks);
    this.router.get("/:id", this.getBookById);
    this.router.put("/:id", this.updateBook);
    this.router.delete("/:id", this.deleteBook);
  }

  private createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await this.service.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  };

  private listBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: BookQueryOptions = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || undefined,
        search: req.query.search as string | undefined,
        genre: req.query.genre as string | undefined,
        inStock:
          typeof req.query.inStock === "string"
            ? req.query.inStock === "true"
            : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      };

      const result = await this.service.listBooks(query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  private getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const book = await this.service.getBookById(req.params.id);
      if (!book) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
      res.json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  };

  private updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updated = await this.service.updateBook(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  private deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deleted = await this.service.deleteBook(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}


