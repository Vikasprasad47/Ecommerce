// import AddressModel from '../models/address.model.js'
// import UserModel from '../models/user.model.js'


// export const addAddressController = async (request, response) => {
//     try {
//         const userId = request.userId //from the middleware
//         const { address_line, landMark, city, state, pincode, country, mobile, address_type } = request.body;

//         const createAddress = new AddressModel({
//             address_line,
//             landMark,
//             city,
//             state,
//             pincode,
//             country,
//             mobile,
//             address_type,
//             userId: userId
//         })

//         const saveAddress = await createAddress.save()

//         const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
//             $push: {
//                 address_details: saveAddress._id
//             }
//         })

//         return response.json({
//             message: "Address added successfully",
//             success:true,
//             error: false,
//             data: saveAddress
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         })
//     }
// }

// export const getAddressController = async (request, response) => {
//     try {
//         const  userId = request.userId //from the middleware

//         const data = await AddressModel.find({userId: userId}).sort({createdAt: -1})

//         return response.json({
//             data: data,
//             message: "Address fetched successfully",
//             error: false,
//             success: true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         })
//     }
// }

// export const updateAddressController = async (request, response) => {
//     try {
//         const userId = request.userId //from the middleware
//         const { _id, address_line, landMark, city, state, pincode, country, mobile, address_type} = request.body

//         const updateAddress = await AddressModel.updateOne({_id: _id, userId: userId},{
//             address_line,
//             landMark,
//             city,
//             state,
//             pincode,
//             country,
//             mobile,
//             address_type
//         })

//         return response.json({
//             message: "Address updated successfully",
//             success: true,
//             error: false,
//             data: updateAddress
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         })
//     }
// }

// export const deleteAddressController = async (request, response) => {
//     try {
//         const userId = request.userId //from the middleware
//         const {_id} = request.body


//         const disableAddress = await AddressModel.updateOne({_id: _id, userId: userId},{
//             status: false
//         })

//         return response.json({
//             message: "Address removed successfully",
//             success: true,
//             error: false,
//             data: disableAddress
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         })
//     }
// }

/**
 * @fileoverview Address Controller
 * Handles user address management with proper validation and error handling
 */

import AddressModel from '../models/address.model.js';
import UserModel from '../models/user.model.js';
import { asyncHandler, ValidationError, NotFoundError, AuthorizationError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Validate address input
 * @param {Object} addressData - Address data to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
const validateAddressInput = (addressData) => {
  const { address_line, city, state, pincode, country, mobile, address_type } = addressData;

  if (!address_line || address_line.trim().length === 0) {
    return 'Address line is required';
  }

  if (address_line.length > 500) {
    return 'Address line cannot exceed 500 characters';
  }

  if (!city || city.trim().length === 0) {
    return 'City is required';
  }

  if (!state || state.trim().length === 0) {
    return 'State is required';
  }

  if (!pincode || !/^\d{5,6}$/.test(pincode)) {
    return 'Valid pincode is required (5-6 digits)';
  }

  if (!country || country.trim().length === 0) {
    return 'Country is required';
  }

  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    return 'Valid 10-digit mobile number is required';
  }

  const validAddressTypes = ['home', 'office', 'other'];
  if (!address_type || !validAddressTypes.includes(address_type.toLowerCase())) {
    return `Address type must be one of: ${validAddressTypes.join(', ')}`;
  }

  return null;
};

/**
 * Add new address for user
 * @route POST /api/address/create
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 */
export const addAddressController = asyncHandler(async (request, response) => {
  try {
    const userId = request.userId;
    const addressData = request.body;

    // Validate input
    const validationError = validateAddressInput(addressData);
    if (validationError) {
      throw ValidationError(validationError);
    }

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw NotFoundError('User');
    }

    // Check address limit (optional: prevent spam)
    const addressCount = await AddressModel.countDocuments({ userId });
    if (addressCount >= 10) {
      throw ValidationError('Maximum 10 addresses allowed per user');
    }

    // Create address
    const createAddress = new AddressModel({
      address_line: addressData.address_line.trim(),
      landMark: addressData.landMark?.trim() || '',
      city: addressData.city.trim(),
      state: addressData.state.trim(),
      pincode: addressData.pincode.trim(),
      country: addressData.country.trim(),
      mobile: addressData.mobile.trim(),
      address_type: addressData.address_type.toLowerCase(),
      userId,
      status: true,
    });

    const saveAddress = await createAddress.save();

    // Add to user's address list
    await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: saveAddress._id }
    });

    logger.info('Address created', { addressId: saveAddress._id, userId });

    return response.status(201).json({
      message: 'Address added successfully',
      success: true,
      error: false,
      data: saveAddress,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Get all addresses for user
 * @route GET /api/address/get
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 */
export const getAddressController = asyncHandler(async (request, response) => {
  try {
    const userId = request.userId;

    // Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw NotFoundError('User');
    }

    // Get all active addresses
    const addresses = await AddressModel.find({ 
      userId, 
      status: true 
    }).sort({ createdAt: -1 });

    logger.info('Addresses retrieved', { userId, count: addresses.length });

    return response.json({
      data: addresses,
      message: 'Addresses fetched successfully',
      error: false,
      success: true,
      count: addresses.length,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Update address
 * @route PUT /api/address/update
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 */
export const updateAddressController = asyncHandler(async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, ...addressData } = request.body;

    if (!_id) {
      throw ValidationError('Address ID is required');
    }

    // Validate input
    const validationError = validateAddressInput(addressData);
    if (validationError) {
      throw ValidationError(validationError);
    }

    // Verify address belongs to user (security check)
    const address = await AddressModel.findById(_id);
    if (!address) {
      throw NotFoundError('Address');
    }

    if (address.userId.toString() !== userId.toString()) {
      throw AuthorizationError('Cannot modify address that does not belong to you');
    }

    // Update address
    const updateAddress = await AddressModel.findByIdAndUpdate(
      _id,
      {
        address_line: addressData.address_line.trim(),
        landMark: addressData.landMark?.trim() || '',
        city: addressData.city.trim(),
        state: addressData.state.trim(),
        pincode: addressData.pincode.trim(),
        country: addressData.country.trim(),
        mobile: addressData.mobile.trim(),
        address_type: addressData.address_type.toLowerCase(),
      },
      { new: true, runValidators: true }
    );

    logger.info('Address updated', { addressId: _id, userId });

    return response.json({
      message: 'Address updated successfully',
      success: true,
      error: false,
      data: updateAddress,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Delete (soft delete) address
 * @route DELETE /api/address/delete
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 */
export const deleteAddressController = asyncHandler(async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    if (!_id) {
      throw ValidationError('Address ID is required');
    }

    // Verify address exists and belongs to user
    const address = await AddressModel.findById(_id);
    if (!address) {
      throw NotFoundError('Address');
    }

    if (address.userId.toString() !== userId.toString()) {
      throw AuthorizationError('Cannot delete address that does not belong to you');
    }

    // Soft delete - mark as inactive
    const disableAddress = await AddressModel.findByIdAndUpdate(
      _id,
      { status: false },
      { new: true }
    );

    logger.info('Address deleted', { addressId: _id, userId });

    return response.json({
      message: 'Address removed successfully',
      success: true,
      error: false,
      data: disableAddress,
    });
  } catch (error) {
    throw error;
  }
});

export default {
  addAddressController,
  getAddressController,
  updateAddressController,
  deleteAddressController,
};