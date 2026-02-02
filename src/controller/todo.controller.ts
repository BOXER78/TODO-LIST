import { Request, Response, NextFunction, Router } from "express";
import { ToDoService } from "../services/todo.service";

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
        this.router.post("/", this.createTask);
        this.router.put("/:id", this.updateTask);
        this.router.delete("/:id", this.deleteTask);
    }

    private getTasks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await this.service.getTasks();
            res.json({ success: true, data: tasks });
        } catch (error) {
            next(error);
        }
    };

    private createTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.createTask(req.body);
            res.status(201).json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    };

    private updateTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.updateTask(req.params.id as string, req.body);
            if (!task) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }
            res.json({ success: true, data: task });
        } catch (error) {
            next(error);
        }
    };

    private deleteTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.deleteTask(req.params.id as string);
            if (!task) {
                return res.status(404).json({ success: false, message: "Task not found" });
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}