import React, { useState, useRef, useEffect } from 'react';
import { IoClose, IoTrashOutline } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastErroe';

const EditCategory = ({ close, fetchData, data: categoryData }) => {
    const [data, setData] = useState({
        _id: categoryData._id,
        name: categoryData.name,
        image: categoryData.image,
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const nameInputRef = useRef(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: data,
            });

            if (response.data.success) {
                toast.dismiss()
                toast.success(response.data.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const response = await uploadImage(file);
        setUploading(false);

        if (response?.data?.data?.url) {
            setData((prev) => ({ ...prev, image: response.data.data.url }));
        }
    };

    const removeImage = () => {
        setData((prev) => ({ ...prev, image: '' }));
    };

    const isFormReady = data.name && data.image && !loading && !uploading;

    return (
        <section className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
                    <button onClick={close} className="text-gray-500 hover:text-amber-600 transition">
                        <IoClose size={26} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {/* Name Field */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            disabled={loading || uploading}
                            className="p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                            placeholder="Enter category name"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Image</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border bg-gray-100 flex items-center justify-center">
                                {uploading ? (
                                    <div className="animate-pulse w-full h-full bg-amber-100" />
                                ) : data.image ? (
                                    <>
                                        <img src={data.image} alt="category" className="object-contain w-full h-full" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-500 hover:text-white transition"
                                            title="Remove"
                                        >
                                            <IoTrashOutline size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-sm text-gray-400">No image</span>
                                )}
                            </div>

                            <label htmlFor="upload" className="cursor-pointer">
                                <div className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg transition">
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </div>
                                <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleUploadImage}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={!isFormReady}
                            className={`w-full py-3 rounded-xl font-medium transition shadow ${
                                isFormReady
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default EditCategory;
