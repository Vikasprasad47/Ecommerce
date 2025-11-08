import SubCategoryModel from "../models/subcategory.model.js"

export const AddSubCategoryController = async (request, response) => {
    try {
        const {name, image, category} = request.body

        if(!name || !image || !category?.[0]){
            return response.status(400).json({
                message: "All field Required",
                error:true,
                success: false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubcategory = new SubCategoryModel(payload)
        const save = await createSubcategory.save()

        return response.json({
            message: "Sub Category Added Successfully!",
            data: save, 
            error: false,
            success:true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}   

export const getSubCategoryController = async (request, response) => {
    try {
        const data = await SubCategoryModel.find().sort({createdAt: -1}).populate('category')
        return response.json({
            message: "subcategory data",
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            messsage: error.message || error,
            error:true,
            success: false
        })
    }
}

export const updateSubCategoryController = async (request, response) => {
    try {
        const { _id, name, image, category } = request.body;

        // Validate input
        if (!_id || !name || !image || !category?.[0]) {
            return response.status(400).json({
                message: "All fields (_id, name, image, category) are required",
                error: true,
                success: false
            });
        }

        // Check if subcategory exists
        const existingSubCategory = await SubCategoryModel.findById(_id);
        if (!existingSubCategory) {
            return response.status(404).json({
                message: "Subcategory not found. Check your ID.",
                error: true,
                success: false
            });
        }

        // Perform the update and return the updated doc
        const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
            _id,
            { name, image, category },
            { new: true } // ensures we return updated doc
        ).populate('category');

        return response.json({
            message: "Sub Category Updated Successfully!",
            data: updatedSubCategory,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteSubCategoryController = async (request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Subcategory ID (_id) is required",
                error: true,
                success: false
            });
        }

        const subcategory = await SubCategoryModel.findById(_id);
        if (!subcategory) {
            return response.status(404).json({
                message: "Sub Category not found. Check the ID.",
                error: true,
                success: false
            });
        }

        await subcategory.deleteOne();

        return response.json({
            message: "Sub Category Deleted Successfully!",
            data: subcategory,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
