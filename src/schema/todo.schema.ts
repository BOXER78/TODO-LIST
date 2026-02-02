import {Schema,Document,model} from "mongoose"
import { title } from "node:process"

interface T_interface extends Document{
    title:String

}
export const ToDoSchema=new Schema({title:String})
export const ToDoModel=model("task",ToDoSchema)