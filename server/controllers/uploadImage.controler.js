import uploadImageCloudinary from "../utils/uploadimagecloudnery.js";

const uploadImageController = async (request, response) => {
    try {
        const file = request.file;

        // Check if file is uploaded
        if (!file) {
            return response.status(400).json({
                message: "No file uploaded",
                error: true,
                success: false
            });
        }

        // Upload image to Cloudinary
        const uploadImage = await uploadImageCloudinary(file);

        return response.json({
            message: "Uploaded Successfully!",
            data: uploadImage,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Image upload failed",
            error: true,
            success: false
        });
    }
};

export default uploadImageController;
