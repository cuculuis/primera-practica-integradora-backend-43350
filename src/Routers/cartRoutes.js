import { Router } from 'express'
import { CartManager } from '../DAO/FileSystemManager/CartManager.js'
import { cartModel } from '../DAO/ModelSchemas/CartModel.js' 

const cartRouter = Router()
const cartManager = new CartManager('./src/DatabaseFS/cartsFS.json')


cartRouter.get('/', async(req, res) => {
    let result = await cartManager.getCarts()
    res.status(201).json({ status: 'success', payload: result })
})

cartRouter.get('/:cid', async(req, res) => {
    try{
        let id = req.params.cid
        let cartById = await cartManager.getCartsById(id)
        if(cartById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        return res.status(201).json({ status: 'success', payload: cartById })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})


cartRouter.post('/', async(req, res) => {
    let addingCart = await cartManager.addCarts()
    return res.status(201).json({ status: 'success', payload: addingCart })
})

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    try{
        let cartId = req.params.cid
        let productId = req.params.pid
        let result = await cartManager.addProductInCart(cartId, productId)
        if( typeof result === 'string'){
            return res.status(400).json({ status: 'error', error: result })
        }
        return res.status(201).json({ status: 'success', payload: result })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})



export { cartRouter };