import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoTrashOutline } from 'react-icons/io5';
import uploadImage from '../utils/uploadImage.js';
import { useSelector } from 'react-redux';
import Axios from '../utils/axios.js';
import SummaryApi from '../comman/summaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastErroe.js';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    image: '',
    category: []
  });
  const [uploading, setUploading] = useState(false);
  const allCategory = useSelector(state => state.product.allCategory);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSubcategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const response = await uploadImage(file);
    setUploading(false);
    const { data: ImageResponse } = response;
    setSubCategoryData(prev => ({ ...prev, image: ImageResponse.data.url }));
  };

  const handleRemoveCategory = (categoryId) => {
    setSubCategoryData(prev => ({
      ...prev,
      category: prev.category.filter(cat => cat._id !== categoryId)
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.dismiss();
        toast.success(responseData.message);
        fetchData?.();
        close?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const isFormValid = subCategoryData.name && subCategoryData.image && subCategoryData.category.length;

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm popupmodel flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6 animate-fade-in overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Add Sub Category</h2>
          <button onClick={close} className="text-gray-500 hover:text-red-500 transition">
            <IoClose size={24} />
          </button>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmitSubCategory}>
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Subcategory Name</label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-amber-500"
              placeholder="Enter Subcategory Name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <div className="w-full sm:w-36 h-36 bg-gray-100 border rounded-xl flex items-center justify-center relative overflow-hidden">
                {uploading ? (
                  <div className="w-full h-full animate-pulse bg-amber-100" />
                ) : subCategoryData.image ? (
                  <>
                    <img src={subCategoryData.image} alt="preview" className="object-contain w-full h-full" />
                    <button type="button" onClick={() => setSubCategoryData(prev => ({ ...prev, image: '' }))} className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white">
                      <IoTrashOutline size={16} />
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage" className="cursor-pointer">
                <div className={`px-5 py-2 rounded-lg text-white transition ${uploading ? 'bg-gray-300' : 'bg-amber-500 hover:bg-amber-600'}`}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </div>
                <input type="file" id="uploadSubCategoryImage" className="hidden" onChange={handleUploadSubcategoryImage} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Categories</label>
            <div className="border border-gray-300 rounded-lg p-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map(cat => (
                  <span key={cat._id} className="bg-amber-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {cat.name}
                    <button type="button" onClick={() => handleRemoveCategory(cat._id)} className="text-gray-600 hover:text-red-600">
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  const categoryDetails = allCategory.find(el => el._id === e.target.value);
                  if (categoryDetails && !subCategoryData.category.some(cat => cat._id === categoryDetails._id)) {
                    setSubCategoryData(prev => ({
                      ...prev,
                      category: [...prev.category, categoryDetails]
                    }));
                  }
                }}
                className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none text-gray-700"
              >
                <option value="">Select Category</option>
                {allCategory.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-lg font-semibold transition ${isFormValid ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
