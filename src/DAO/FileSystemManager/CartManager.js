import fs from 'fs';

class CartManager {

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

    async addNewCart() {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            const newCart = {
                products: []
            }
            let lastId = allCarts.length > 0 ? allCarts[allCarts.length - 1].id : 0;
            newCart.id = lastId + 1;
            allCarts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
            
            return `The cart was created with id: ${newCart.id}.`
        } catch (err) {
            console.log('There was an error: ' + err);
        }
    }

    async addProductToCart(idCart, idProduct) {
            
        let allCarts = await this.getCarts();
        const cart = await this.getCartById(idCart);
        if (!cart) {
            return false;
        }
        
        const existingProduct = cart.products.find((item) => item.product === idProduct);
        if (existingProduct) {
            existingProduct.quantity++; 
        } else {
            const product = {
                product: idProduct,
                quantity: 1,
                };
            cart.products.push(product);
        }
        const cartIndex = allCarts.findIndex((item) => item.id === idCart);
        if (cartIndex !== -1) {
            allCarts[cartIndex] = cart;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
        return cart;
    }

    async deleteProductToCart(idCart, idProduct) {
        try {
            let allCarts = await this.getCarts();
            const cart = await this.getCartById(idCart);
            if (!cart) {
                return false;
            }
        
            const existingProductIndex = cart.products.findIndex((item) => item.product === idProduct);
            if (existingProductIndex !== -1) {
                const existingProduct = cart.products[existingProductIndex];
                if (existingProduct.quantity > 1) {
                existingProduct.quantity--;
                } 
                if (existingProduct.quantity == 1) {
                cart.products.splice(existingProductIndex, 1);
                } 
                const cartIndex = allCarts.findIndex((item) => item.id === idCart);
                if (cartIndex !== -1) {
                allCarts[cartIndex] = cart;
                }
        
                await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
                return cart;
            } else {
                return false
            }
        
            } catch (error) {
            console.error(`Error removing product from cart: ${error}`);
            return false;
        }
    }


    async getCarts() {
        await this.checkFileExists()    
            try {
                let allCarts = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(allCarts);
            } catch (err) {
                console.log('There was an error: ' + err);
        }
    }

    async getCartById(cartId) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            let cart = allCarts.find((item) => item.id === cartId);
                if (cart) {
                    return cart;
                } else {
                    return false;
                }
            } catch (err) {
                console.log('There was an error: ' + err);
            }
    }

    async deleteCartById(idCart) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts()
            let cart = allCarts.filter((item) => item.id !== idCart)
            await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2))
            return `Cart with id: ${idCart} deleted successfully.`
        } catch (err) {
            console.log(err);
        }
    }

}

export { CartManager };