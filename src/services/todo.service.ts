import { ToDoModel } from "../schema/todo.schema";

export class ToDoService {
  async getTasks() {
    return await ToDoModel.find();
  }

  async createTask(data: any) {
    return await ToDoModel.create(data);
  }

  async updateTask(id: string, data: any) {
    return await ToDoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string) {
    return await ToDoModel.findByIdAndDelete(id);
  }
}

