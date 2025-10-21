import React, { useState, useEffect } from 'react';
import { RiFolderUploadLine, RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { IoClose, IoAddCircleOutline } from "react-icons/io5";
import { FiPackage, FiTag, FiTruck } from "react-icons/fi";
import { BiCategory, BiDetail } from "react-icons/bi";
import { BsCurrencyDollar, BsPercent, BsBoxSeam } from "react-icons/bs";
import uploadImage from '../utils/uploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { useSelector } from 'react-redux';
import AddfieldComponent from '../components/AddfieldComponent';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import AxiosToastError from '../utils/AxiosToastErroe';
import successAlert from '../utils/successAlert';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MdCurrencyRupee } from "react-icons/md";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $getSelection } from "lexical";
import { useFormContext } from "react-hook-form";


// Validation Schema
const productSchema = yup.object().shape({
    name: yup.string()
        .required('Product name is required')
        .min(3, 'Product name must be at least 3 characters')
        .max(120, 'Product name cannot exceed 120 characters'),
    description: yup.string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters'),
    category: yup.array()
        .min(1, 'Select at least one category')
        .required('Category is required'),
    unit: yup.string()
        .required('Unit is required')
        .oneOf(['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen', 'box'], 'Invalid unit'),
    stock: yup.number()
        .required('Stock is required')
        .min(0, 'Stock cannot be negative')
        .integer('Stock must be a whole number'),
    price: yup.number()
        .required('Price is required')
        .min(0, 'Price cannot be negative'),
    discount: yup.number()
        .min(0, 'Discount cannot be negative')
        .test(
            'is-less-than-price',
            'Discount must be less than price',
            function(value) {
                return value <= this.parent.price;
            }
        ),
    images: yup.array()
        .min(1, 'Upload at least one image')
        .max(10, 'Cannot upload more than 10 images')
});

const Productpage = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            name: "",
            images: [],
            category: [],
            subCategory: [],
            unit: "",
            stock: "",
            price: "",
            discount: "",
            description: "",
            specifications: {},
            tags: [],
            variants: [],
            shipping: {
                weight: "",
                dimensions: {
                    length: "",
                    width: "",
                    height: ""
                },
                freeShipping: false
            },
            meta: {
                title: "",
                description: "",
                keywords: []
            }
        }
    });

    const user = useSelector(state => state.user)
    const [imageLoading, setImageLoading] = useState(false);
    const [viewImageUrl, setViewImageUrl] = useState("");
    const allCategory = useSelector(state => state.product.allCategory);
    const allSubCategory = useSelector(state => state.product.allSubCategory);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [openAddField, setOpenAddField] = useState(false);
    const [fieldName, setFieldName] = useState("");
    const [fieldValue, setFieldValue] = useState("");
    const [activeTab, setActiveTab] = useState("basic");
    const [tagInput, setTagInput] = useState("");
    const [variantInput, setVariantInput] = useState({
        color: "",
        size: "",
        sku: "",
        price: "",
        stock: "",
        images: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slugPreview, setSlugPreview] = useState("");

    // Watch form values
    const watchedValues = watch();

    // Generate slug preview
    useEffect(() => {
        if (watchedValues.name) {
            setSlugPreview(slugify(watchedValues.name, { lower: true, strict: true }));
        }
    }, [watchedValues.name]);

    // Handle image upload
    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('Image size should be less than 5MB');
            return;
        }

        setImageLoading(true);
        try {
            const response = await uploadImage(file);
            const currentImages = watchedValues.images || [];
            setValue("images", [...currentImages, response.data.data.url]);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert('Failed to upload image');
        }
        setImageLoading(false);
    };

    // Delete image
    const handleDeleteImage = (index) => {
        const updatedImages = [...watchedValues.images];
        updatedImages.splice(index, 1);
        setValue("images", updatedImages);
    };

    // Add category
    const handleAddCategory = (e) => {
        const categoryId = e.target.value;
        if (!categoryId) return;

        const category = allCategory.find(c => c._id === categoryId);
        if (category && !watchedValues.category.some(c => c._id === category._id)) {
            const currentCategories = watchedValues.category || [];
            setValue("category", [...currentCategories, category]);
            setSelectedCategory("");
        }
    };

    // Remove category
    const handleRemoveCategory = (index) => {
        const updatedCategories = [...watchedValues.category];
        updatedCategories.splice(index, 1);
        setValue("category", updatedCategories);
    };

    // Add subcategory
    const handleAddSubCategory = (e) => {
        const subCategoryId = e.target.value;
        if (!subCategoryId) return;

        const subCategory = allSubCategory.find(sc => sc._id === subCategoryId);
        if (subCategory && !watchedValues?.subCategory.some(sc => sc._id === subCategory._id)) {
            const currentSubCategories = watchedValues?.subCategory || [];
            setValue("subCategory", [...currentSubCategories, subCategory]);
            setSelectedSubCategory("");
        }
    };

    // Remove subcategory
    const handleRemoveSubCategory = (index) => {
        const updatedSubCategories = [...watchedValues.subCategory];
        updatedSubCategories.splice(index, 1);
        setValue("subCategory", updatedSubCategories);
    };

    // Add specification field
    const handleAddField = () => {
        if (!fieldName.trim()) return;

        const currentSpecs = watchedValues.specifications || {};
        setValue("specifications", {
            ...currentSpecs,
            [fieldName]: fieldValue
        });
        setFieldName("");
        setFieldValue("");
        setOpenAddField(false);
    };

    // Remove specification field
    const handleRemoveSpecification = (key) => {
        const { [key]: removed, ...remainingSpecs } = watchedValues.specifications;
        setValue("specifications", remainingSpecs);
    };

    // Add tag
    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        const currentTags = watchedValues.tags || [];
        if (!currentTags.includes(tagInput)) {
            setValue("tags", [...currentTags, tagInput]);
            setTagInput("");
        }
    };

    // Remove tag
    const handleRemoveTag = (index) => {
        const updatedTags = [...watchedValues.tags];
        updatedTags.splice(index, 1);
        setValue("tags", updatedTags);
    };

    // Add variant
    const handleAddVariant = () => {
        if (!variantInput.color || !variantInput.size || !variantInput.price || !variantInput.stock) {
            alert('Please fill all required variant fields');
            return;
        }

        const currentVariants = watchedValues.variants || [];
        setValue("variants", [...currentVariants, variantInput]);
        setVariantInput({
            color: "",
            size: "",
            sku: "",
            price: "",
            stock: "",
            images: []
        });
    };

    // Remove variant
    const handleRemoveVariant = (index) => {
        const updatedVariants = [...watchedValues.variants];
        updatedVariants.splice(index, 1);
        setValue("variants", updatedVariants);
    };

    
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Prepare full product data to send to the backend
            // Spread all form data, then override or add extra fields as needed
            const productData = {
            ...data,
            slug: slugPreview,
            createdBy: user._id, // Replace with real user ID from auth context or redux
            category: selectedCategory ? [selectedCategory] : Array.isArray(data.category) ? data.category : [],
            subCategory: selectedSubCategory ? [selectedSubCategory] : Array.isArray(data.subCategory) ? data.subCategory : [],

            specifications: data.specifications || {}, // ensure object is defined
            shipping: {
                ...data.shipping,
                dimensions: {
                length: data.shipping?.dimensions?.length || "",
                width: data.shipping?.dimensions?.width || "",
                height: data.shipping?.dimensions?.height || "",
                },
            },
            tags: data.tags || [],
            variants: data.variants || [],
            image: data.images || [],
            meta: {
                title: data.meta?.title || "",
                description: data.meta?.description || "",
                keywords: data.meta?.keywords || [],
            },
            };

            // Optionally, validate or format data here before sending

            const response = await Axios({
            ...SummaryApi.createProduct,
            data: productData,
            });

            if (response.data.success) {
            successAlert(response.data.message);
            reset(); // reset form after successful submit
            // Reset local states if needed:
            setSelectedCategory("");
            setSelectedSubCategory("");
            setSlugPreview("");
            // Reset other UI states if necessary
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="font-medium flex items-center gap-2">
                                    <BiDetail /> Product Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter Product Name"
                                    {...register("name")}
                                    className={`bg-gray-100 outline-none p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-amber-300 rounded-md`}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                
                                {watchedValues.name && (
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Slug:</span> {slugPreview}
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="description" className="font-medium flex items-center gap-2">
                                    <BiDetail />
                                    Description
                                </label>

                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Description <span className="text-red-500">*</span>
                                    </label>

                                    <textarea
                                    id="description"
                                    name="description"
                                    value={watchedValues.description}
                                    onChange={(e) => setValue("description", e.target.value)}
                                    placeholder="Enter product description..."
                                    rows={5}
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition-shadow"
                                    required
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                    Use formatting to highlight product features. Keep it clear and concise.
                                    </p>
                                </div>

                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <p className="font-medium flex items-center gap-2">
                                    <RiFolderUploadLine /> Product Images
                                </p>
                                <label htmlFor="productImage" className="bg-gray-100 h-24 md:h-28 border border-dashed border-gray-400 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-200 transition">
                                    <div className="flex flex-col items-center">
                                        {imageLoading ? <Loading /> : (
                                            <>
                                                <RiFolderUploadLine size={35} className="text-gray-700" />
                                                <p className="text-gray-700 text-sm mt-1">Upload Image</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="productImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUploadImage}
                                    />
                                </label>
                                {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {watchedValues.images?.map((img, index) => (
                                        <div key={index} className="relative h-24 w-24 min-w-24 bg-gray-100 border rounded-md shadow-md cursor-pointer">
                                            <img
                                                src={img}
                                                alt="Uploaded"
                                                className="w-full h-full object-cover rounded-md"
                                                onClick={() => setViewImageUrl(img)}
                                            />
                                            <button
                                                onClick={() => handleDeleteImage(index)}
                                                className="absolute bottom-1 right-1 p-1 bg-red-600 hover:bg-red-500 rounded-full text-white transition-all cursor-pointer"
                                            >
                                                <MdOutlineDeleteOutline size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "categories":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className='grid gap-2'>
                                <label className="font-medium flex items-center gap-2">
                                    <BiCategory /> Categories
                                </label>
                                <div>
                                    <div className='flex flex-wrap gap-2 mb-2'>
                                        {watchedValues.category?.map((c, index) => (
                                            <span key={c._id} className="bg-amber-200 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                                                <div className='flex items-center justify-between gap-2 cursor-pointer'>
                                                    <p>{c.name}</p>
                                                    <div onClick={() => handleRemoveCategory(index)} className='hover:text-red-600'>
                                                        <IoClose />
                                                    </div>
                                                </div>
                                            </span>
                                        ))}
                                    </div>
                                    <select
                                        className='bg-gray-100 border w-full outline-none p-2 rounded'
                                        value={selectedCategory}
                                        onChange={handleAddCategory}
                                    >
                                        <option value="">Select Category</option>
                                        {allCategory.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                                </div>
                            </div>

                            <div className='grid gap-2'>
                                <label className="font-medium flex items-center gap-2">
                                    <BiCategory /> Sub Categories
                                </label>
                                <div>
                                    <div className='flex flex-wrap gap-2 mb-2'>
                                        {watchedValues.subCategory?.map((sc, index) => (
                                            <span key={sc._id} className="bg-amber-200 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                                                <div className='flex items-center justify-between gap-2 cursor-pointer'>
                                                    <p>{sc.name}</p>
                                                    <div onClick={() => handleRemoveSubCategory(index)} className='hover:text-red-600'>
                                                        <IoClose />
                                                    </div>
                                                </div>
                                            </span>
                                        ))}
                                    </div>
                                    <select
                                        className='bg-gray-100 border w-full outline-none p-2 rounded'
                                        value={selectedSubCategory}
                                        onChange={handleAddSubCategory}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {allSubCategory.map((sc) => (
                                            <option key={sc._id} value={sc._id}>{sc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='grid gap-2'>
                                <label className="font-medium flex items-center gap-2">
                                    <FiTag /> Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {watchedValues.tags?.map((tag, index) => (
                                        <span key={index} className="bg-blue-100 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                                            <div className='flex items-center justify-between gap-2 cursor-pointer'>
                                                <p>{tag}</p>
                                                <div onClick={() => handleRemoveTag(index)} className='hover:text-red-600'>
                                                    <IoClose />
                                                </div>
                                            </div>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder="Add tag"
                                        className="bg-gray-100 outline-none p-2 border border-gray-300 focus:border-amber-300 rounded-md flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="group flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                    >
                                        <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "pricing":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="unit" className="font-medium flex items-center gap-2">
                                    <FiPackage /> Unit
                                </label>
                                <select
                                    id="unit"
                                    {...register("unit")}
                                    className={`bg-gray-100 outline-none p-3 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} focus:border-amber-300 rounded-md`}
                                >
                                    <option value="">Select Unit</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Gram (g)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="piece">Piece</option>
                                    <option value="pack">Pack</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="box">Box</option>
                                </select>
                                {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="stock" className="font-medium flex items-center gap-2">
                                    <BsBoxSeam /> Stock Quantity
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    placeholder="Enter Product Stock"
                                    {...register("stock")}
                                    className={`bg-gray-100 outline-none p-3 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:border-amber-300 rounded-md`}
                                />
                                {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="price" className="font-medium flex items-center gap-2">
                                    <MdCurrencyRupee /> Price
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    placeholder="Enter Product Price"
                                    {...register("price")}
                                    className={`bg-gray-100 outline-none p-3 border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:border-amber-300 rounded-md`}
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="discount" className="font-medium flex items-center gap-2">
                                    <BsPercent /> Discount
                                </label>
                                <input
                                    id="discount"
                                    type="number"
                                    placeholder="Enter Product Discount"
                                    {...register("discount")}
                                    className={`bg-gray-100 outline-none p-3 border ${errors.discount ? 'border-red-500' : 'border-gray-300'} focus:border-amber-300 rounded-md`}
                                />
                                {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
                                
                                {watchedValues.price && (
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">Discounted Price:</span> ₹
                                        {(watchedValues.price * (1 - (watchedValues.discount || 0) / 100)).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
            case "specifications":
                return (
                    <>
                        <div className="grid gap-3">
                            <div className="grid gap-2">
                                <label className="font-medium flex items-center gap-2">
                                    <MdInfoOutline /> Specifications
                                </label>
                                
                                {Object.entries(watchedValues.specifications || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={key}
                                                readOnly
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => {
                                                    const updatedSpecs = { ...watchedValues.specifications };
                                                    updatedSpecs[key] = e.target.value;
                                                    setValue("specifications", updatedSpecs);
                                                }}
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecification(key)}
                                            className="p-2 text-red-600 hover:text-red-800"
                                        >
                                            <RiDeleteBinLine size={20} />
                                        </button>
                                    </div>
                                ))}
                                
                                <button
                                    type="button"
                                    onClick={() => setOpenAddField(true)}
                                    className="flex items-center gap-2 py-2 px-3 w-fit rounded cursor-pointer bg-slate-200 hover:bg-slate-300 text-center font-semibold mt-2"
                                >
                                    <IoAddCircleOutline /> Add Specification
                                </button>
                            </div>
                        </div>
                    </>
                );
            case "variants":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="font-medium flex items-center gap-2">
                                    <FiPackage /> Product Variants
                                </label>
                                
                                {watchedValues.variants?.map((variant, index) => (
                                    <div key={index} className="border p-4 rounded-md grid gap-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-600">Color</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={variant.color}
                                                        readOnly
                                                        className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Size</label>
                                                <input
                                                    type="text"
                                                    value={variant.size}
                                                    readOnly
                                                    className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Price</label>
                                                <input
                                                    type="text"
                                                    value={variant.price}
                                                    readOnly
                                                    className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Stock</label>
                                                <input
                                                    type="text"
                                                    value={variant.stock}
                                                    readOnly
                                                    className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariant(index)}
                                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                            >
                                                <RiDeleteBinLine /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="border p-4 rounded-md grid gap-4 mt-4">
                                    <h3 className="font-medium">Add New Variant</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Color*</label>
                                            <input
                                                type="text"
                                                value={variantInput.color}
                                                onChange={(e) => setVariantInput({...variantInput, color: e.target.value})}
                                                placeholder="e.g. Red"
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Size*</label>
                                            <input
                                                type="text"
                                                value={variantInput.size}
                                                onChange={(e) => setVariantInput({...variantInput, size: e.target.value})}
                                                placeholder="e.g. XL"
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">SKU</label>
                                            <input
                                                type="text"
                                                value={variantInput.sku}
                                                onChange={(e) => setVariantInput({...variantInput, sku: e.target.value})}
                                                placeholder="e.g. PROD-RED-XL"
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Price*</label>
                                            <input
                                                type="number"
                                                value={variantInput.price}
                                                onChange={(e) => setVariantInput({...variantInput, price: e.target.value})}
                                                placeholder="0.00"
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Stock*</label>
                                            <input
                                                type="number"
                                                value={variantInput.stock}
                                                onChange={(e) => setVariantInput({...variantInput, stock: e.target.value})}
                                                placeholder="0"
                                                className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
    type="button"
    onClick={handleAddVariant}
    className="group flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
>
    <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Add Variant
</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "shipping":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="font-medium flex items-center gap-2">
                                    <FiTruck /> Shipping Information
                                </label>
                                
                                <div className="grid gap-2">
                                    <label className="text-sm text-gray-600">Weight (kg)</label>
                                    <input
                                        type="number"
                                        {...register("shipping.weight")}
                                        placeholder="0.00"
                                        className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <label className="text-sm text-gray-600">Dimensions (cm)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="number"
                                            {...register("shipping.dimensions.length")}
                                            placeholder="Length"
                                            className="bg-gray-100 p-2 border border-gray-300 rounded-md"
                                        />
                                        <input
                                            type="number"
                                            {...register("shipping.dimensions.width")}
                                            placeholder="Width"
                                            className="bg-gray-100 p-2 border border-gray-300 rounded-md"
                                        />
                                        <input
                                            type="number"
                                            {...register("shipping.dimensions.height")}
                                            placeholder="Height"
                                            className="bg-gray-100 p-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="freeShipping"
                                        {...register("shipping.freeShipping")}
                                        className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                                    />
                                    <label htmlFor="freeShipping" className="text-sm text-gray-600">
                                        Free Shipping
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "seo":
                return (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="font-medium flex items-center gap-2">
                                    <FiTag /> SEO Settings
                                </label>
                                
                                <div className="grid gap-2">
                                    <label className="text-sm text-gray-600">Meta Title</label>
                                    <input
                                        type="text"
                                        {...register("meta.title")}
                                        placeholder="Product meta title"
                                        className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <label className="text-sm text-gray-600">Meta Description</label>
                                    <textarea
                                        {...register("meta.description")}
                                        placeholder="Product meta description"
                                        rows={3}
                                        className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <label className="text-sm text-gray-600">Keywords (comma separated)</label>
                                    <textarea
                                        {...register("meta.keywords")}
                                        placeholder="keyword1, keyword2, keyword3"
                                        rows={2}
                                        className="bg-gray-100 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <section className="w-full px-4 pb-4">
            <div className='flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl p-5 mb-3 shadow-sm'>
                <h2 className='font-semibold lg:text-2xl text-neutral-800'>Upload Product</h2>
                <button 
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`relative px-6 py-3 font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                    } rounded-xl`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Publishing...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Publish Product
                        </span>
                    )}
                </button>
            </div>

            <div className="mt-2 grid gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap gap-2 sm:gap-4">
                    {["basic", "categories", "pricing", "variants", "specifications", "shipping", "seo"].map((tab) => (
                        <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-3 border-b-2 font-medium text-sm capitalize ${
                            activeTab === tab
                            ? 'border-amber-500 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        >
                        {tab.replace('-', ' ')}
                        </button>
                    ))}
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    {renderTabContent()}

                    {activeTab !== "basic" && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative px-6 py-3 font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-md hover:shadow-lg'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Product
                                </span>
                            )}
                        </button>
                    </div>
                    )}
                </form>
            </div>


            {viewImageUrl && <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />}

            {openAddField && (
                <AddfieldComponent
                    fieldName={fieldName}
                    fieldValue={fieldValue}
                    onNameChange={(e) => setFieldName(e.target.value)}
                    onValueChange={(e) => setFieldValue(e.target.value)}
                    submit={handleAddField}
                    close={() => {
                        setFieldName("");
                        setFieldValue("");
                        setOpenAddField(false);
                    }}
                />
            )}
        </section>
    );
};

export default Productpage;