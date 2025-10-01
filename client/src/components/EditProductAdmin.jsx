import React, { useState } from 'react';
import { RiFolderUploadLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux';
import AddfieldComponent from '../components/AddfieldComponent';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import successAlert from '../utils/successAlert';
import Divider from './Divider';

const EditProductAdmin = ({ close, data: productData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: productData._id,
    name: productData.name,
    image: productData.image,
    category: productData.category,
    subCategory: productData.subCategory,
    unit: productData.unit,
    stock: productData.stock,
    price: productData.price,
    discount: productData.discount,
    description: productData.description,
    more_details: productData.more_details || {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handelUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      const imageUrl = ImageResponse.data.url;
      setData(prev => ({ ...prev, image: [...prev.image, imageUrl] }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setImageLoading(false);
  };

  const handelDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData(prev => ({ ...prev, image: updatedImages }));
  };

  const handelRemoveCategory = (index) => {
    setData(prev => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handelRemoveSubCategory = (index) => {
    setData(prev => ({
      ...prev,
      subCategory: prev.subCategory.filter((_, i) => i !== index),
    }));
  };

  const handelAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProdctDetails,
        data: data
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        if (close) close();
        fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 popupmodel flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-y-auto max-h-[65vh] lg:max-h-[95vh] shadow-xl p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
          <button onClick={close} className="text-gray-600 hover:text-red-500">
            <IoClose size={24} />
          </button>
        </div>
        <Divider/>
        {/* Form */}
        <form onSubmit={handelSubmit} className="grid gap-6">
          
          {/* Product Name */}
          <div className='pt-3'>
            <label className="block mb-2 font-semibold">Product Name</label>
            <input 
              type="text"
              name="name"
              value={data.name}
              onChange={handelChange}
              placeholder="Enter product name"
              className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handelChange}
              placeholder="Enter product description"
              className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400 resize-none"
              rows="4"
              required
            />
          </div>

          {/* Upload Images */}
          <div>
            <p className="font-semibold mb-2">Product Images</p>
            <label htmlFor="productImage" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              {imageLoading ? <Loading /> : (
                <>
                  <RiFolderUploadLine size={40} className="text-gray-400" />
                  <span className="text-gray-500 text-sm mt-2">Click to upload</span>
                </>
              )}
              <input id="productImage" type="file" className="hidden" accept="image/*" onChange={handelUploadImage} />
            </label>

            {/* Uploaded Images */}
            <div className="flex flex-wrap gap-4 mt-4">
              {data.image.map((img, index) => (
                <div key={index} className="relative h-24 w-24 rounded overflow-hidden shadow-md bg-gray-100">
                  <img
                    src={img}
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                    onClick={() => setViewImageUrl(img)}
                  />
                  <button 
                    type="button"
                    onClick={() => handelDeleteImage(index)}
                    className="absolute bottom-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    <MdOutlineDeleteOutline size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Category</label>
              <select 
                value={selectCategory}
                onChange={(e) => {
                  const category = allCategory.find(el => el._id === e.target.value);
                  if (category && !data.category.some(cat => cat._id === category._id)) {
                    setData(prev => ({ ...prev, category: [...prev.category, category] }));
                  }
                  setSelectCategory("");
                }}
                className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Category</option>
                {allCategory.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <div className="flex flex-wrap mt-2 gap-2">
                {data.category.map((c, index) => (
                  <div key={index} className="bg-amber-100 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {c.name}
                    <IoClose className="cursor-pointer" onClick={() => handelRemoveCategory(index)} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Sub Category</label>
              <select 
                value={selectSubCategory}
                onChange={(e) => {
                  const sub = allSubCategory.find(el => el._id === e.target.value);
                  if (sub && !data.subCategory.some(subcat => subcat._id === sub._id)) {
                    setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                  }
                  setSelectSubCategory("");
                }}
                className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Sub Category</option>
                {allSubCategory.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <div className="flex flex-wrap mt-2 gap-2">
                {data.subCategory.map((c, index) => (
                  <div key={index} className="bg-amber-100 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {c.name}
                    <IoClose className="cursor-pointer" onClick={() => handelRemoveSubCategory(index)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Other Fields */}
          {["unit", "stock", "price", "discount"].map(field => (
            <div key={field}>
              <label className="block mb-2 font-semibold capitalize">{field}</label>
              <input
                type={field === "unit" ? "text" : "number"}
                name={field}
                value={data[field]}
                onChange={handelChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          ))}

          {/* More Details */}
          {Object.keys(data.more_details).map((key, index) => (
            <div key={index}>
              <label className="block mb-2 font-semibold capitalize">{key}</label>
              <input
                type="text"
                value={data.more_details[key]}
                onChange={(e) => {
                  setData(prev => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [key]: e.target.value
                    }
                  }));
                }}
                className="w-full p-3 rounded-md bg-gray-100 border focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          ))}

          <div>
            <button type="button" onClick={() => setOpenAddField(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md font-semibold">
              Add More Field
            </button>
          </div>

          <button type="submit" className="bg-amber-400 hover:bg-amber-300 w-full py-3 rounded-md text-lg font-semibold transition">
            Update Product
          </button>

        </form>

        {/* View Image Modal */}
        {viewImageUrl && <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />}

        {/* Add Field Modal */}
        {openAddField && (
          <AddfieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handelAddField}
            close={() => setOpenAddField(false)}
          />
        )}

      </div>
    </section>
  );
};

export default EditProductAdmin;
