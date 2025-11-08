import {Router} from 'express'
import auth from '../middleware/auth.js'
import { addToCartItemsController, deleteCartItemsQtyController, getCartItemsController, updateCartItemsController } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post('/create',auth, addToCartItemsController)
cartRouter.get('/get',auth, getCartItemsController)
cartRouter.put('/update-qty',auth, updateCartItemsController)
cartRouter.delete('/delete-cart-items',auth, deleteCartItemsQtyController)

export default cartRouter