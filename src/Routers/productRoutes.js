import { Router } from "express";
import { productModel } from "../DAO/ModelSchemas/ProductModel.js";
import ProductManager from "../DAO/FileSystemManager/ProductManager.js"

const productRouter = Router();
const productManager = new ProductManager('./src/DatabaseFS/productsFS.json')

productRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productModel.find();
        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json({ products: products });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: error.message });
    }
});

productRouter.get("/:pid", async (req, res) => {
    try {
    
        const pid = req.params.pid;
        
        const product = await productModel.findById(pid);
        
        if (product === null) {
        return res.status(404).json({ error: `The product does not exist` });
        }
    
        res.json({ payload: product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error en el servidor" });
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const product = req.body;
        const addProduct = await productModel.create(product);
        const products = await productModel.find().lean().exec();
        
        req.app.get("socketio").emit("updatedProducts", products);
        res.status(201).json({ status: "success", payload: addProduct });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});

productRouter.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
    
        if (req.body.id !== pid && req.body.id !== undefined) {
            return res
                .status(404)
                .json({ error: "No se puede modificar el id del producto" });
                }
            const updated = req.body;
    
    
        const productFind = await productModel.findById(pid);
    
    
        if (!productFind) {
            return res.status(404).json({ error: `The product does not exist` });
            }
    
    
        await productModel.updateOne({ _id: pid }, updated);
        const updatedProducts = await productModel.find();

        req.app.get("socketio").emit("updatedProducts", updatedProducts);
        res.json({ message: `Actualizando el producto: ${productFind.title}` });
        } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
        }
});

productRouter.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const result = await productModel.findByIdAndDelete(productId);
        if (result === null) {
            return res.status(404).json({
            status: "error",
            error: `No such product with id: ${productId}`,
            });
        }

    const updatedProducts = await productModel.find().lean().exec();
    
    req.app.get("socketio").emit("updatedProducts", updatedProducts);
    res.json({
        message: `Product with id ${productId} removed successfully`,
        products: updatedProducts,
        });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    }
});

export { productRouter } ;