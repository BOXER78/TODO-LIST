import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { bookRouter } from "./routes/book.routes";
import { todoRouter } from "./routes/todo.routes";

dotenv.config();

// Add this line to serve static files
import path from "path";


interface AppInterface {
  startServer(): void;
  connectDatabase(): Promise<void>;
  initializeMiddlewares(): void;
  initializeRoutes(): void;
}

export class App implements AppInterface {
  private readonly port: number;
  public app: Application;

  constructor() {
    this.port = Number(process.env.PORT) || 4000;
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public async startServer(): Promise<void> {
    await this.connectDatabase();
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public async connectDatabase(): Promise<void> {
    const uri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sesd_workshop";

    try {
      await mongoose.connect(uri);
      console.log("Database connected");
    } catch (err) {
      console.error("Failed to connect to database", err);
      process.exit(1);
    }
  }

  public initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, "../public"))); // Serve public folder
  }

  public initializeRoutes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      res.json({ message: "OOP CRUD API is running" });
    });



    // ...

    this.app.use("/api/books", bookRouter);
    this.app.use("/api/todos", todoRouter); // Add route registration
  }

  private initializeErrorHandling(): void {

    this.app.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err);
        res
          .status(400)
          .json({ success: false, message: err.message || "Something went wrong" });
      }
    );
  }
}