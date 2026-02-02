import mongoose from "mongoose";
import { ToDoDocument, ToDoModel } from "../schema/todo.schema";

export interface ToDoQueryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    isCompleted?: boolean;
    priority?: "low" | "medium" | "high";
}

export class ToDoRepository {
    async create(data: Partial<ToDoDocument>): Promise<ToDoDocument> {
        const todo = new ToDoModel(data);
        return await todo.save();
    }

    async findById(id: string): Promise<ToDoDocument | null> {
        return await ToDoModel.findById(id);
    }

    async findAll(query: ToDoQueryOptions) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            isCompleted,
            priority,
        } = query;

        const filter: any = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (typeof isCompleted === "boolean") {
            filter.isCompleted = isCompleted;
        }

        if (priority) {
            filter.priority = priority;
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            ToDoModel.find(filter).sort(sort).skip(skip).limit(limit),
            ToDoModel.countDocuments(filter),
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
        data: Partial<ToDoDocument>
    ): Promise<ToDoDocument | null> {
        return await ToDoModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id: string): Promise<ToDoDocument | null> {
        return await ToDoModel.findByIdAndDelete(id);
    }
}
