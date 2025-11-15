// utils/helpers/uploadSellerDocument.js
import Axios from "../network/axios";
import SummaryApi from "../../comman/summaryApi";

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Client-side image compression (skip for PDFs)
const compressImage = (file, quality = 0.7, maxWidth = 1200) => {
  return new Promise((resolve) => {
    // Skip compression for non-images or small images
    if (!file.type.startsWith("image/") || file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile.size < file.size ? compressedFile : file);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => resolve(file); // Fallback to original file
      img.src = e.target.result;
    };

    reader.onerror = () => resolve(file); // Fallback to original file
    reader.readAsDataURL(file);
  });
};

const validateFile = (file) => {
  if (!file) return { valid: true };

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `File "${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `File "${file.name}" has invalid type. Only JPG, PNG, WEBP, PDF are allowed.`,
    };
  }

  return { valid: true };
};

const uploadSellerDocument = async ({
  gstFile,
  panFile,
  addressProof,
  onUploadProgress,
  enableCompression = true,
}) => {
  try {
    const files = { gstFile, panFile, addressProof };
    const formData = new FormData();
    let hasFiles = false;

    for (const [fieldName, file] of Object.entries(files)) {
      if (!file) continue;

      const validation = validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          message: validation.message,
        };
      }

      let processedFile = file;

      if (enableCompression && file.type !== "application/pdf") {
        processedFile = await compressImage(file);
      }

      formData.append(fieldName, processedFile);
      hasFiles = true;
    }

    if (!hasFiles) {
      return {
        success: false,
        message: "No documents selected for upload.",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const response = await Axios({
      url: SummaryApi.uploadSellerKycDocuments.url,
      method: SummaryApi.uploadSellerKycDocuments.method,
      data: formData,
      signal: controller.signal,
      timeout: 60000,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (event.total && onUploadProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(percent);
        }
      },
    });

    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);

    if (error.name === "AbortError") {
      return {
        success: false,
        message: "Upload timeout. Please try again with smaller files.",
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        success: false,
        message: "Connection timeout. Please check your internet connection.",
      };
    }

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Upload failed. Please try again.",
    };
  }
};

export default uploadSellerDocument;
