import fs from 'fs';

class ProductManager {

    constructor(path) {
        this.path = path;
        this.checkFileExists()
    }

    async checkFileExists() {
        try {
        await fs.promises.access(this.path);
        } catch (err) {
            await fs.promises.writeFile(this.path, "[]")
            console.log(`The file ${this.path} does not exist`);
        }
    }

    validateProduct(title, description, code, price, status, stock, category) {
        return !title || !description || !price || !status || !code || !stock || !category 
    }

    async checkCodeExists(code) {
        const products = await this.getProducts();
        const existingProduct = products.find(product => product.code === code);
        
        return existingProduct
    }

    async addProduct(newProduct) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();
            
            let lastId = allProducts.length > 0 ? allProducts[allProducts.length - 1].id : 0;
            newProduct.id = lastId + 1;

            allProducts.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2));
            
            return `Se agregó el producto: ${newProduct.title} con id: ${newProduct.id}`
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async getProducts() {
        await this.checkFileExists()    
            try {
                let allProducts = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(allProducts);
            } catch (err) {
                console.log('Hubo un error: ' + err);
        }
    }

    async getProductById(productId) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();
            let product = allProducts.find((item) => item.id === productId);
                if (product) {
                    return product;
                } else {
                    return false;
                }
            } catch (err) {
                console.log('Hubo un error: ' + err);
            }
    }

    async updateProduct(idProduct, productNow) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();
            const index = allProducts.findIndex((item) => item.id === idProduct);
            if (index === -1) {
                return { error: 'producto no encontrado.'}
            }

            allProducts[index] = {...productNow, id: idProduct}
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2));
            return `Se actualizó el producto con id: ${idProduct}`;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteProductById(idProduct) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts()
            let product = allProducts.filter((item) => item.id !== idProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(product, null, 2))
            return `Producto con id: ${idProduct} borrado exitosamente.`
        } catch (err) {
            console.log(err);
        }
    }

}

export default ProductManager;