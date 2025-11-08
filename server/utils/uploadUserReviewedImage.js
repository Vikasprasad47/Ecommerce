const uploadUserImageDatatocloudinary = async (image) => {
    const buffer = image.buffer;

    const uploadImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce/usersProductReviewedImageData" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });

    return uploadImage;
};
