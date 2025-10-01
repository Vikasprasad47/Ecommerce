import CartProductModel from '../models/cartproduct.model.js';
import UserModel from '../models/user.model.js';

export const addToCartItemsController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(402).json({
                message: "Provide Product Id",
                success: false,
                error: true
            });
        }

        const save = await CartProductModel.updateOne(
            { userId, productId },
            { $inc: { quantity: 1 } },
            { upsert: true }
        );

        await UserModel.updateOne({ _id: userId }, {
            $addToSet: { shopping_cart: productId }
        });

        return response.json({
            data: save,
            message: "Item(s) Added Successfully!",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};

export const getCartItemsController = async (request, response) => {
    try {
        const userId = request.userId;

        const cartItem = await CartProductModel.find({ userId })
            .populate('productId')
            .lean();

        return response.json({
            data: cartItem,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};

export const updateCartItemsController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id, qty } = request.body;

        if (!_id || qty === undefined) {
            return response.status(400).json({
                message: "Provide _id and qty",
            });
        }

        const updateCartItem = await CartProductModel.updateOne(
            { _id, userId },
            { quantity: qty }
        );

        return response.json({
            message: "Item quantity updated",
            success: true,
            error: false,
            data: updateCartItem
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};

export const deleteCartItemsQtyController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            });
        }

        const deleteCartItem = await CartProductModel.deleteOne({ _id, userId });

        return response.json({
            message: "Item Removed Successfully!",
            error: false,
            success: true,
            data: deleteCartItem
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};
