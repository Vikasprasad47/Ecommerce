// import CategoryModel from "../models/category.model.js";
// import SubCategoryModel from "../models/subcategory.model.js"
// import ProductModel from "../models/product.model.js"


// export const AddCategoryController = async (request, response) => {
//     try {
//         const {name, image} = request.body

//         if(!name || !image){
//             return response.status(400).json({
//                 message: "Enter Required Fields",
//                 error:true,
//                 success: false
//             })
//         }
//         const addCategory = new CategoryModel({
//             name,
//             image
//         })

//         const saveCategory = await addCategory.save()

//         if(!saveCategory){
//             return response.status(500).json({
//                 message: "Category Not Added",
//                 error:true,
//                 success:false
//             })
//         }

//         return response.json({
//             message: "Category Added Successfully",
//             data: saveCategory,
//             success: true,
//             error: false
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error:true,
//             success:false
//         })
//     }
// }

// export const getCategoryController = async (request, response) => {
//     try {
//         const data = await CategoryModel.find().sort({createdAt: -1})
//         return response.json({
//             data: data,
//             error: false,
//             success: true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }

// export const updateCategoryController = async (request, response) => {
//     try {
//         const {_id, name, image} = request.body
//         const update = await CategoryModel.updateOne({
//             _id: _id
//         },{
//             name,
//             image
//         })
//         return response.json({
//             message: "Category Updated Successfully!",
//             error:false,
//             success:true,
//             data: update
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }

// export const deleteCategoryController = async (request, response) => {
//     try {
//         const {_id} = request.body

//         const checkSubcategory = await SubCategoryModel.find({
//             category: {
//                 "$in": [_id]
//             }
//         }).countDocuments()

//         const checkProduct = await ProductModel.find({
//             category: {
//                 "$in": [_id]
//             }
//         }).countDocuments()

//         if(checkSubcategory > 0 || checkProduct > 0){
//             return response.status(400).json({
//                 message: "Sub Category or Product Already Exist!, for this Category",
//                 error: true,
//                 success: false
//             })
//         }

//         const deleteCategory = await CategoryModel.deleteOne({_id: _id})
//         return response.json({
//             message: "Category Deleted Successfully!",
//             data: deleteCategory,
//             error:false,
//             success:true
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error:true,
//             success:false
//         })
//     }
// }

/**
 * @fileoverview Category Controller
 * Handles category management with validation and error handling
 */

import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subcategory.model.js';
import ProductModel from '../models/product.model.js';
import { asyncHandler, ValidationError, NotFoundError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Validate category input
 */
const validateCategoryInput = (name, image) => {
  if (!name || name.trim().length === 0) {
    return 'Category name is required';
  }

  if (name.length > 100) {
    return 'Category name cannot exceed 100 characters';
  }

  if (!image || image.trim().length === 0) {
    return 'Category image URL is required';
  }

  // Validate URL format
  try {
    new URL(image);
  } catch {
    return 'Invalid image URL format';
  }

  return null;
};

/**
 * Add new category
 * @route POST /api/category/add
 */
export const AddCategoryController = asyncHandler(async (request, response) => {
  try {
    const { name, image } = request.body;

    // Validate input
    const validationError = validateCategoryInput(name, image);
    if (validationError) {
      throw ValidationError(validationError);
    }

    // Check for duplicate
    const existingCategory = await CategoryModel.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i')
    });

    if (existingCategory) {
      throw ValidationError(`Category "${name}" already exists`);
    }

    // Create category
    const addCategory = new CategoryModel({
      name: name.trim(),
      image: image.trim(),
    });

    const saveCategory = await addCategory.save();

    logger.info('Category created', { categoryId: saveCategory._id, name });

    return response.status(201).json({
      message: 'Category added successfully',
      data: saveCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Get all categories
 * @route GET /api/category/list
 */
export const getCategoryController = asyncHandler(async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get paginated data
    const [data, totalCount] = await Promise.all([
      CategoryModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CategoryModel.countDocuments(),
    ]);

    logger.info('Categories retrieved', { count: data.length, page, limit });

    return response.json({
      data,
      error: false,
      success: true,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Update category
 * @route PUT /api/category/update
 */
export const updateCategoryController = asyncHandler(async (request, response) => {
  try {
    const { _id, name, image } = request.body;

    if (!_id) {
      throw ValidationError('Category ID is required');
    }

    // Validate input
    const validationError = validateCategoryInput(name, image);
    if (validationError) {
      throw ValidationError(validationError);
    }

    // Check if category exists
    const category = await CategoryModel.findById(_id);
    if (!category) {
      throw NotFoundError('Category');
    }

    // Check for duplicate name (exclude current category)
    const existingCategory = await CategoryModel.findOne({
      _id: { $ne: _id },
      name: new RegExp(`^${name.trim()}$`, 'i')
    });

    if (existingCategory) {
      throw ValidationError(`Category "${name}" already exists`);
    }

    // Update category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      _id,
      {
        name: name.trim(),
        image: image.trim(),
      },
      { new: true, runValidators: true }
    );

    logger.info('Category updated', { categoryId: _id, name });

    return response.json({
      message: 'Category updated successfully!',
      error: false,
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    throw error;
  }
});

/**
 * Delete category (with safety checks)
 * @route DELETE /api/category/delete
 */
export const deleteCategoryController = asyncHandler(async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      throw ValidationError('Category ID is required');
    }

    // Check if category exists
    const category = await CategoryModel.findById(_id);
    if (!category) {
      throw NotFoundError('Category');
    }

    // Check for dependent sub-categories
    const subCategoryCount = await SubCategoryModel.countDocuments({
      category: { $in: [_id] }
    });

    // Check for dependent products
    const productCount = await ProductModel.countDocuments({
      category: { $in: [_id] }
    });

    if (subCategoryCount > 0 || productCount > 0) {
      throw ValidationError(
        `Cannot delete category. It has ${subCategoryCount} sub-categories and ${productCount} products. Delete them first.`
      );
    }

    // Delete category
    const deleteCategory = await CategoryModel.findByIdAndDelete(_id);

    logger.info('Category deleted', { categoryId: _id, name: category.name });

    return response.json({
      message: 'Category deleted successfully!',
      data: deleteCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    throw error;
  }
});

export default {
  AddCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
};