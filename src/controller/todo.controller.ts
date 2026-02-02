import { Request, Response, NextFunction, Router } from "express";
import { ToDoService } from "../services/todo.service";
import { ToDoQueryOptions } from "../repositories/todo.repository";

export class ToDoController {
    public router: Router;
    private service: ToDoService;

    constructor(service = new ToDoService()) {
        this.router = Router();
        this.service = service;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", this.getTasks);
        this.router.get("/:id", this.getTaskById);
        this.router.post("/", this.createTask);
        this.router.put("/:id", this.updateTask);
        this.router.delete("/:id", this.deleteTask);
    }

    private getTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const query: ToDoQueryOptions = {
                page: req.query.page ? Number(req.query.page) : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                sortBy: req.query.sortBy as string | undefined,
                sortOrder: (req.query.sortOrder as "asc" | "desc") || undefined,
                search: req.query.search as string | undefined,
                isCompleted:
                    typeof req.query.isCompleted === "string"
                        ? req.query.isCompleted === "true" // Convert string to boolean
                        : undefined,
                priority: req.query.priority as "low" | "medium" | "high" | undefined,
            };

            const result = await this.service.getTasks(query);
            res.json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    private getTaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.service.getTaskById(req.params.id as string);
            if (!task) {
                return res
                    .status(404)
                    .json({ success: false, message: "Task not found" });
            }
            res.json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    };

    private createTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.service.createTask(req.body);
            res.status(201).json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    };

    private updateTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.service.updateTask(
                req.params.id as string,
                req.body
            );
            if (!task) {
                return res
                    .status(404)
                    .json({ success: false, message: "Task not found" });
            }
            res.json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    };

    private deleteTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = await this.service.deleteTask(req.params.id as string);
            if (!task) {
                return res
                    .status(404)
                    .json({ success: false, message: "Task not found" });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}