import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../comman/summaryApi';
import Axios from '../utils/axios';
import AxiosToastError from '../utils/AxiosToastErroe';
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, search, fetchProductData }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <span key={index} className="font-semibold text-black">{part}</span>
            ) : (
                part
            )
        );
    };

    const handelDeleteCancel = ()=> {
        setOpenDelete(false)
    } 

    const handleDelete = async ()=> {
        try {
            const response = await Axios({
                ...SummaryApi.deleteProduct,
                data: {
                    _id: data._id

                }
            })

            const {data: responseData} = response

            if(responseData.success){
                toast.dismiss();
                toast.success(responseData.message)
                if(fetchProductData){
                    fetchProductData()
                }
                setOpenDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <>
            {/* Normal Product Card */}
            <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center cursor-pointer hover:scale-101 transition">
                <div className="w-32 h-32 flex justify-center items-center overflow-hidden rounded-md bg-gray-100">
                    <img 
                        src={data?.image?.[0]} 
                        alt={data?.name} 
                        className="w-full h-full object-contain"
                    />
                </div>
                <p className="mt-2 text-sm text-gray-700 text-center line-clamp-2">
                    {highlightText(data?.name || '', search)}
                </p>
                <p className="text-gray-500 mt-1 line-clamp-1">Unit: {data?.unit}</p>
                <div className="grid grid-cols-2 gap-4 my-2">
                    <button onClick={() => setEditOpen(true)} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition">
                        Edit
                    </button>
                    <button onClick={() => setOpenDelete(true)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition">
                        Delete
                    </button>
                </div>
            </div>

            {/* Fullscreen Overlay */}
            {editOpen && (
                <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
            )}

            {
                openDelete && (
                    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-500/60 z-800 p-4 flex items-center justify-center'>
                        <div className='bg-white rounded p-4 w-full max-w-md'>
                            <div className='flex items-center justify-between gap-4'>
                                <h3 className='font-semibold'>Delete Permanently</h3>
                                <button onClick={() => setOpenDelete(false)} className='cursor-pointer hover:bg-amber-400 rounded transition-all'>
                                    <IoClose size={25}/>
                                </button>
                            </div>
                            <p className='my-2'>Are you sure you want to delete it permanently?</p>
                            <div className='flex justify-end gap-5 py-2'>
                                <button onClick={handelDeleteCancel} className='border px-3 py-1 rounded cursor-pointer hover:bg-green-600 bg-green-500 text-white'>Cancel</button>
                                <button onClick={handleDelete} className='border px-3 py-1 rounded cursor-pointer hover:bg-red-600 bg-red-500 text-white'>Delete</button>
                            </div>
                        </div>
                    </section>
                )
            }
        </>
    );
};

export default ProductCardAdmin;
