import React, { useState } from 'react';
import { RiFolderUploadLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/helpers/uploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux';
import AddfieldComponent from '../components/AddfieldComponent';
import Axios from '../utils/network/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/network/AxiosToastError';
import successAlert from '../utils/notifications/successAlert';
import toast from 'react-hot-toast';

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
    more_details: productData.specifications || {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [viewImageUrl, setViewImageUrl] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [step, setStep] = useState(0); // 👈 wizard step (0‒4)

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
        [fieldName]: fieldValue || ""
      }
    }));

    setFieldName("");
    setFieldValue("");
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
      toast.dismiss();
      AxiosToastError(error);
    }
  };

  const steps = [
    "Basic Info",
    "Images",
    "Pricing & Stock",
    "Categories",
    "More Details",
  ];

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="fixed inset-0 bg-black/50 popupmodel flex items-center justify-center p-4 z-[200]">
      <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 min-h-[50vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              Edit product
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Update product details using a guided wizard. Your changes will reflect everywhere.
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handelSubmit} className="flex flex-col max-h-[80vh]">
          {/* Step Pills */}
          <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {steps.map((label, index) => {
                const isActive = index === step;
                const isCompleted = index < step;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs border min-w-fit transition-all
                      ${
                        isActive
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold
                        ${
                          isActive
                            ? "bg-white text-amber-600"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {index + 1}
                    </span>
                    <span className="truncate max-w-[90px] sm:max-w-[140px]">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
            {/* STEP 1: Basic Info */}
            {step === 0 && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                      Product name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={handelChange}
                      placeholder="Enter product name"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={data.description}
                      onChange={handelChange}
                      placeholder="Enter product description"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none resize-none"
                      rows="5"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try to be descriptive – quality, usage, key features, etc.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Unit */}
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                      Unit
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={data.unit}
                      onChange={handelChange}
                      placeholder="e.g. kg, piece, pack"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  {/* Quick info */}
                  <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/70 text-[11px] text-amber-900">
                    <p className="font-medium mb-1.5">Tip</p>
                    <p>
                      Basic info appears in listings and search results.
                      Keep the title short, clear and descriptive.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Images */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    Product images
                  </p>
                  <label
                    htmlFor="productImage"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-amber-50/60 hover:border-amber-400 transition-all"
                  >
                    {imageLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <RiFolderUploadLine size={36} className="text-slate-400" />
                        <span className="text-slate-500 text-xs mt-2">
                          Click to upload (JPG, PNG, WEBP)
                        </span>
                      </>
                    )}
                    <input
                      id="productImage"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handelUploadImage}
                    />
                  </label>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Use clear images with a clean background. Multiple angles
                    increase trust.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-2">
                  {data.image.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-24 w-24 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={img}
                        alt="Uploaded"
                        className="object-cover w-full h-full cursor-pointer"
                        onClick={() => setViewImageUrl(img)}
                      />
                      <button
                        type="button"
                        onClick={() => handelDeleteImage(index)}
                        className="absolute bottom-1 right-1 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow"
                      >
                        <MdOutlineDeleteOutline size={14} />
                      </button>
                    </div>
                  ))}
                  {data.image.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No images added yet. Add at least one product image.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Pricing & Stock */}
            {step === 2 && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700 capitalize">
                      stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={data.stock}
                      onChange={handelChange}
                      placeholder="Enter stock"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700 capitalize">
                      price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={data.price}
                      onChange={handelChange}
                      placeholder="Enter price"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-700 capitalize">
                      discount
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={data.discount}
                      onChange={handelChange}
                      placeholder="Enter discount"
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      If you use percentage discount in backend, keep value
                      between 0–100.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/80 text-[11px] text-emerald-900">
                    <p className="font-medium mb-1">Suggestion</p>
                    <p>
                      Keep stock & pricing realistic. Low stock can be used for
                      urgency messaging on the customer side.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Categories */}
            {step === 3 && (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={selectCategory}
                    onChange={(e) => {
                      const category = allCategory.find(el => el._id === e.target.value);
                      if (category && !data.category.some(cat => cat._id === category._id)) {
                        setData(prev => ({ ...prev, category: [...prev.category, category] }));
                      }
                      setSelectCategory("");
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {allCategory.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <div className="flex flex-wrap mt-2 gap-2">
                    {data.category.map((c, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 text-[11px] px-3 py-1 rounded-full flex items-center gap-1 border border-amber-100"
                      >
                        <span>{c.name}</span>
                        <IoClose
                          className="cursor-pointer text-xs hover:text-amber-900"
                          onClick={() => handelRemoveCategory(index)}
                        />
                      </div>
                    ))}
                    {data.category.length === 0 && (
                      <p className="text-[11px] text-slate-400">
                        No category selected yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-700">
                    Sub Category
                  </label>
                  <select
                    value={selectSubCategory}
                    onChange={(e) => {
                      const sub = allSubCategory.find(el => el._id === e.target.value);
                      if (sub && !data.subCategory.some(subcat => subcat._id === sub._id)) {
                        setData(prev => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                      }
                      setSelectSubCategory("");
                    }}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                  >
                    <option value="">Select Sub Category</option>
                    {allSubCategory.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <div className="flex flex-wrap mt-2 gap-2">
                    {data.subCategory.map((c, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 text-[11px] px-3 py-1 rounded-full flex items-center gap-1 border border-slate-200"
                      >
                        <span>{c.name}</span>
                        <IoClose
                          className="cursor-pointer text-xs hover:text-slate-900"
                          onClick={() => handelRemoveSubCategory(index)}
                        />
                      </div>
                    ))}
                    {data.subCategory.length === 0 && (
                      <p className="text-[11px] text-slate-400">
                        No sub category selected yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: More Details */}
            {step === 4 && (
              <div className="space-y-4">
                {/* More Details Fields */}
                <div className="space-y-3">
                  {Object.keys(data.more_details).length === 0 && (
                    <div className="border border-dashed border-slate-200 rounded-lg px-3 py-3 text-[12px] text-slate-500">
                      No additional fields yet. You can add custom details like
                      Material, Brand, Shelf life, etc.
                    </div>
                  )}

                  {Object.keys(data.more_details).map((key, index) => (
                    <div key={index}>
                      <label className="block mb-1.5 text-xs font-semibold text-slate-700 capitalize">
                        {key}
                      </label>
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
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-amber-400/70 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOpenAddField(true)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    Add more field
                  </button>

                  <div className="text-[11px] text-slate-500 text-right">
                    Use extra fields to capture details customers care about.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              Step {step + 1} of {steps.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 0}
                className="px-4 py-2 rounded-lg border border-slate-300 text-[11px] sm:text-xs text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-lg bg-amber-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-amber-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-[11px] sm:text-xs font-semibold hover:bg-emerald-700"
                >
                  Update product
                </button>
              )}
            </div>
          </div>
        </form>

        {/* View Image Modal */}
        {viewImageUrl && (
          <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />
        )}

        {/* Add Field Modal (kept exactly like your original usage) */}
        {openAddField && (
          <AddfieldComponent
            fieldName={fieldName}
            fieldValue={fieldValue}
            onNameChange={(e) => setFieldName(e.target.value)}
            onValueChange={(e) => setFieldValue(e.target.value)}
            submit={handelAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </section>
  );
};

export default EditProductAdmin;
