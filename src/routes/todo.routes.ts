import { Router } from "express";
import { ToDoController } from "../controller/todo.controller";

const todoController = new ToDoController();
const todoRouter = Router();

// todoRouter.use(authMiddleware); // Optional: add auth if needed
todoRouter.use("/", todoController.router);

export { todoRouter };
