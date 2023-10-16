import mongoose from "mongoose";
import { cliente } from "../DBConnection/mongoConnection.js";

const productSchema = new mongoose.Schema({
    
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    thumbnails: { 
        type: [String], 
        default: [] 
    },
    code: { 
        type: String, 
        required: true,
        unique: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    },

});

export const productModel = mongoose.model('products', productSchema);