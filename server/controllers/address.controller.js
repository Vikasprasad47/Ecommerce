import AddressModel from '../models/address.model.js'
import UserModel from '../models/user.model.js'


export const addAddressController = async (request, response) => {
    try {
        const userId = request.userId //from the middleware
        const { address_line, landMark, city, state, pincode, country, mobile, address_type } = request.body;

        const createAddress = new AddressModel({
            address_line,
            landMark,
            city,
            state,
            pincode,
            country,
            mobile,
            address_type,
            userId: userId
        })

        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push: {
                address_details: saveAddress._id
            }
        })

        return response.json({
            message: "Address added successfully",
            success:true,
            error: false,
            data: saveAddress
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const getAddressController = async (request, response) => {
    try {
        const  userId = request.userId //from the middleware

        const data = await AddressModel.find({userId: userId}).sort({createdAt: -1})

        return response.json({
            data: data,
            message: "Address fetched successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const updateAddressController = async (request, response) => {
    try {
        const userId = request.userId //from the middleware
        const { _id, address_line, landMark, city, state, pincode, country, mobile, address_type} = request.body

        const updateAddress = await AddressModel.updateOne({_id: _id, userId: userId},{
            address_line,
            landMark,
            city,
            state,
            pincode,
            country,
            mobile,
            address_type
        })

        return response.json({
            message: "Address updated successfully",
            success: true,
            error: false,
            data: updateAddress
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const deleteAddressController = async (request, response) => {
    try {
        const userId = request.userId //from the middleware
        const {_id} = request.body


        const disableAddress = await AddressModel.updateOne({_id: _id, userId: userId},{
            status: false
        })

        return response.json({
            message: "Address removed successfully",
            success: true,
            error: false,
            data: disableAddress
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}