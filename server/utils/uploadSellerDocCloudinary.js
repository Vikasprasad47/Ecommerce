import { v2 as cloudinary } from "cloudinary";

const uploadSellerDocCloudinary = async (file, folder) => {
  const buffer = file.buffer;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export default uploadSellerDocCloudinary;
