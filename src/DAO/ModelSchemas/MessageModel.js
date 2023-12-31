import mongoose from "mongoose";
import { cliente } from "../DBConnection/mongoConnection.js";

const messageSchema = new mongoose.Schema({
    user: {
        type: String, 
        required: true
        },
    message: {
        type: String, 
        required: true
        }
})

export const messageModel = mongoose.model('messages', messageSchema)

