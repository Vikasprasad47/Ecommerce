import multer from 'multer';

// Memory storage so image stays in buffer (good for Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow only specific image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, PNG, JPG, and WEBP images are allowed"), false);
    }

    cb(null, true);
};

// Multer config
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max size
    },
    fileFilter
});

export default upload;
