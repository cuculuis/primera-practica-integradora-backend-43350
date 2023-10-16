import mongoose from "mongoose";
import { cliente } from "../DBConnection/mongoConnection.js";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                _id: false,
                product: mongoose.ObjectId,
                quantity: Number,
            },
            ],
        default: [],
        },
})

export const cartModel = mongoose.model('carts', cartSchema)