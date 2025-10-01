import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/uploadImage.js';
import { useSelector } from 'react-redux';
import Axios from '../utils/axios.js';
import SummaryApi from '../comman/summaryApi.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastErroe.js';

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category: data.category || []
  });

  const allCategory = useSelector(state => state.product.allCategory);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handelUploadSubcategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setSubCategoryData(prev => ({ ...prev, image: ImageResponse.data.url }));
  };

  const handelRemoveCategory = (categoryId) => {
    setSubCategoryData(prev => ({
      ...prev,
      category: prev.category.filter(cat => cat._id !== categoryId)
    }));
  };

  const handelSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
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

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm popupmodel flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 space-y-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Sub Category</h2>
          <button onClick={close} className="text-gray-500 hover:text-red-500 transition">
            <IoClose size={24} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handelSubmitSubCategory}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              id="name"
              name="name"
              value={subCategoryData.name}
              onChange={handelChange}
              type="text"
              placeholder="Enter subcategory name"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-40 border rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {subCategoryData.image ? (
                  <img src={subCategoryData.image} alt="Subcategory" className="object-contain max-h-full max-w-full" />
                ) : (
                  <span className="text-sm text-gray-400">No Image</span>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage" className="cursor-pointer">
                <div className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handelUploadSubcategoryImage}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Category</label>
            <div className="border border-gray-300 rounded-lg p-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {subCategoryData.category.map(cat => (
                  <span key={cat._id} className="bg-amber-200 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => handelRemoveCategory(cat._id)}
                      className="hover:text-red-600 transition"
                    >
                      <IoClose size={16} />
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(el => el._id === value);
                  if (categoryDetails && !subCategoryData.category.some(cat => cat._id === categoryDetails._id)) {
                    setSubCategoryData(prev => ({
                      ...prev,
                      category: [...prev.category, categoryDetails]
                    }));
                  }
                }}
                className="w-full bg-white p-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="">Select Category</option>
                {allCategory.map(category => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200
              ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-amber-200 cursor-not-allowed'}`}
            disabled={!(subCategoryData.name && subCategoryData.image && subCategoryData.category.length)}
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;