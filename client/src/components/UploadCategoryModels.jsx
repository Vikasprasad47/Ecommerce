import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoTrashOutline } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastErroe';

const UploadCategoryModels = ({ close, fetchData }) => {
  const [data, setData] = useState({ name: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.dismiss();
        toast.success(responseData.message);
        close?.();
        fetchData?.();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const response = await uploadImage(file);
    setUploading(false);

    const { data: ImageResponse } = response;
    if (ImageResponse?.data?.url) {
      setData(prev => ({ ...prev, image: ImageResponse.data.url }));
    }
  };

  const removeImage = () => setData(prev => ({ ...prev, image: '' }));

  const isReady = data.name && data.image && !loading && !uploading;

  return (
    <section className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Category</h2>
          <button onClick={close} className="text-gray-600 hover:text-amber-500 transition">
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="space-y-1">
            <label htmlFor="categoryName" className="text-sm text-gray-700 font-medium">Category Name</label>
            <input
              ref={nameRef}
              id="categoryName"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter category name"
              disabled={loading || uploading}
              className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300 outline-none focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">Image</p>
            <div className="flex gap-4 flex-col sm:flex-row items-center">
              <div className="relative w-full sm:w-36 h-36 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border">
                {uploading ? (
                  <div className="animate-pulse bg-amber-100 w-full h-full" />
                ) : data.image ? (
                  <>
                    <img src={data.image} alt="preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                      title="Remove Image"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">No image</span>
                )}
              </div>

              <label htmlFor="uploadImage" className="cursor-pointer">
                <div className={`${!data.name ? "bg-gray-300 text-black" : "bg-amber-500 text-white hover:bg-amber-600"} px-5 py-2 rounded-lg font-medium transition`}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </div>
                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  disabled={!data.name || uploading}
                  onChange={handleUploadCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isReady}
              className={`w-full py-3 rounded-xl font-semibold shadow transition ${
                isReady
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Submitting..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModels;
