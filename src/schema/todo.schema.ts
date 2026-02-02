import { Schema, Document, model } from "mongoose";

export interface ToDoDocument extends Document {
    title: string;
    description?: string;
    isCompleted: boolean;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ToDoSchema = new Schema<ToDoDocument>(
    {
        title: { type: String, required: true },
        description: { type: String },
        isCompleted: { type: Boolean, default: false },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: { type: Date },
    },
    { timestamps: true }
);

export const ToDoModel = model<ToDoDocument>("ToDo", ToDoSchema);