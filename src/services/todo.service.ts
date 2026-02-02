import { ToDoDocument } from "../schema/todo.schema";
import { ToDoQueryOptions, ToDoRepository } from "../repositories/todo.repository";

export interface CreateToDoDTO {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}

export interface UpdateToDoDTO {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
}

export class ToDoService {
  private repository: ToDoRepository;

  constructor(repository = new ToDoRepository()) {
    this.repository = repository;
  }

  async getTasks(query: ToDoQueryOptions) {
    return await this.repository.findAll(query);
  }

  async getTaskById(id: string): Promise<ToDoDocument | null> {
    return await this.repository.findById(id);
  }

  async createTask(data: CreateToDoDTO): Promise<ToDoDocument> {
    this.validateCreateData(data);
    return await this.repository.create(data);
  }

  async updateTask(id: string, data: UpdateToDoDTO): Promise<ToDoDocument | null> {
    this.validateUpdateData(data);
    return await this.repository.update(id, data);
  }

  async deleteTask(id: string): Promise<ToDoDocument | null> {
    return await this.repository.delete(id);
  }

  private validateCreateData(data: CreateToDoDTO) {
    if (!data.title) {
      throw new Error("Title is required");
    }
    if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
      throw new Error("Invalid priority value");
    }
  }

  private validateUpdateData(data: UpdateToDoDTO) {
    if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
      throw new Error("Invalid priority value");
    }
  }
}

