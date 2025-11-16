// import React, { useState } from 'react';
// import EditProductAdmin from './EditProductAdmin';
// import { IoClose } from 'react-icons/io5';
// import SummaryApi from '../comman/summaryApi';
// import Axios from '../utils/network/axios';
// import AxiosToastError from '../utils/network/AxiosToastError';
// import toast from 'react-hot-toast'

// const ProductCardAdmin = ({ data, search, fetchProductData }) => {
//     const [editOpen, setEditOpen] = useState(false)
//     const [openDelete, setOpenDelete] = useState(false)
    
//     const highlightText = (text, searchTerm) => {
//         if (!searchTerm) return text;

//         const regex = new RegExp(`(${searchTerm})`, 'gi');
//         return text.split(regex).map((part, index) =>
//             part.toLowerCase() === searchTerm.toLowerCase() ? (
//                 <span key={index} className="font-semibold text-black">{part}</span>
//             ) : (
//                 part
//             )
//         );
//     };

//     const handelDeleteCancel = ()=> {
//         setOpenDelete(false)
//     } 

//     const handleDelete = async ()=> {
//         try {
//             const response = await Axios({
//                 ...SummaryApi.deleteProduct,
//                 data: {
//                     _id: data._id

//                 }
//             })

//             const {data: responseData} = response

//             if(responseData.success){
//                 toast.dismiss();
//                 toast.success(responseData.message)
//                 if(fetchProductData){
//                     fetchProductData()
//                 }
//                 setOpenDelete(false)
//             }
//         } catch (error) {
//             toast.dismiss();
//             AxiosToastError(error)
//         }
//     }

//     return (
//         <>
//             {/* Normal Product Card */}
//             <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center cursor-pointer hover:scale-101 transition">
//                 <div className="w-32 h-32 flex justify-center items-center overflow-hidden rounded-md bg-gray-100">
//                     <img 
//                         src={data?.image?.[0]} 
//                         alt={data?.name} 
//                         className="w-full h-full object-contain"
//                     />
//                 </div>
//                 <p className="mt-2 text-sm text-gray-700 text-center line-clamp-2">
//                     {highlightText(data?.name || '', search)}
//                 </p>
//                 <p className="text-gray-500 mt-1 line-clamp-1">Unit: {data?.unit}</p>
//                 <div className="grid grid-cols-2 gap-4 my-2">
//                     <button onClick={() => setEditOpen(true)} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition">
//                         Edit
//                     </button>
//                     <button onClick={() => setOpenDelete(true)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition">
//                         Delete
//                     </button>
//                 </div>
//             </div>

//             {/* Fullscreen Overlay */}
//             {editOpen && (
//                 <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
//             )}

//             {
//                 openDelete && (
//                     <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-500/60 z-800 p-4 flex items-center justify-center'>
//                         <div className='bg-white rounded p-4 w-full max-w-md'>
//                             <div className='flex items-center justify-between gap-4'>
//                                 <h3 className='font-semibold'>Delete Permanently</h3>
//                                 <button onClick={() => setOpenDelete(false)} className='cursor-pointer hover:bg-amber-400 rounded transition-all'>
//                                     <IoClose size={25}/>
//                                 </button>
//                             </div>
//                             <p className='my-2'>Are you sure you want to delete it permanently?</p>
//                             <div className='flex justify-end gap-5 py-2'>
//                                 <button onClick={handelDeleteCancel} className='border px-3 py-1 rounded cursor-pointer hover:bg-green-600 bg-green-500 text-white'>Cancel</button>
//                                 <button onClick={handleDelete} className='border px-3 py-1 rounded cursor-pointer hover:bg-red-600 bg-red-500 text-white'>Delete</button>
//                             </div>
//                         </div>
//                     </section>
//                 )
//             }
//         </>
//     );
// };

// export default ProductCardAdmin;

// src/components/ProductCardAdmin.jsx
import React, { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/network/axios";
import AxiosToastError from "../utils/network/AxiosToastError";
import toast from "react-hot-toast";

import {
  FaEdit,
  FaTrash,
  FaTag,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

/* ------------------------------------------------------------------ */
/* Inline SimpleConfirmModal                                          */
/* ------------------------------------------------------------------ */
const SimpleConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-200">
        <div className="px-4 py-3 border-b bg-rose-50 border-rose-100 flex items-center gap-2 text-rose-700">
          <FaExclamationTriangle className="text-sm" />
          <p className="text-sm font-semibold">{title}</p>
        </div>

        <div className="px-5 py-4 text-sm text-slate-700">
          {message}
        </div>

        <div className="px-5 pb-4 pt-2 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-xs text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ProductCardAdmin — full UI consistent with ProductAdmin            */
/* ------------------------------------------------------------------ */
const ProductCardAdmin = ({ data, search, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const highlightText = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="font-semibold text-slate-900">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: { _id: data._id },
      });

      const { data: res } = response;

      if (res.success) {
        toast.success(res.message || "Product deleted");
        fetchProductData && fetchProductData();
        setOpenDelete(false);
      }
    } catch (err) {
      toast.dismiss();
      AxiosToastError(err);
    }
  };

  /* ------------------- PRICE ----------------------- */
  const discountedPrice =
    typeof data.discountedPrice === "number"
      ? data.discountedPrice
      : data.price;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <>
      {/* CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-col hover:shadow-md transition-all">
            {/* IMAGE */}
            <div className="">
                <div className="relative w-full pb-[75%] rounded-xl overflow-hidden bg-slate-50">
                <img
                    src={data?.image?.[0]}
                    alt={data?.name}
                    className="absolute inset-0 w-full h-full object-contain p-2"
                />

                {/* Featured Badge */}
                {data.featured && (
                    <span className="absolute left-2 top-2 px-2 py-1 rounded-full bg-amber-500 text-[10px] font-semibold text-white flex items-center gap-1">
                    <FaTag className="text-[9px]" />
                    Featured
                    </span>
                )}

                {/* Publish status */}
                <span
                    className={`absolute right-2 top-2 px-2 py-1 rounded-full text-[10px] font-medium ${
                    data.publish
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                >
                    {data.publish ? "Published" : "Hidden"}
                </span>
                </div>

                <div>
                    {/* NAME */}
                    <p className="mt-3 text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem]">
                    {highlightText(data?.name || "", search)}
                    </p>

                    {/* PRICE + STOCK */}
                    <div className="mt-2 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-emerald-700">
                        {formatCurrency(discountedPrice)}
                        </p>
                        {data.discount > 0 && (
                        <p className="text-[11px] text-slate-400 line-through">
                            {formatCurrency(data.price)}
                        </p>
                        )}
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                        Stock:{" "}
                        <span
                        className={
                            data.stock > 0
                            ? "text-emerald-600 font-medium"
                            : "text-rose-500 font-medium"
                        }
                        >
                        {data.stock}
                        </span>
                    </div>
                    </div>

                    {/* UNIT */}
                    <p className="text-xs text-slate-500 mt-1">
                    Unit: {data?.unit}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                    {/* EDIT */}
                    <button
                        onClick={() => setEditOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 transition-colors"
                    >
                        <FaEdit className="text-[10px]" />
                        Edit
                    </button>

                    {/* DELETE */}
                    <button
                        onClick={() => setOpenDelete(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 text-[11px] font-medium border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                        <FaTrash className="text-[10px]" />
                        Delete
                    </button>
                    </div>
                </div>
            </div>
        </div>

      {/* DELETE CONFIRMATION */}
      <SimpleConfirmModal
        open={openDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${data.name}" permanently?`}
        onConfirm={handleDelete}
        onCancel={() => setOpenDelete(false)}
      />

      {/* EDIT MODAL */}
      {editOpen && (
        <EditProductAdmin
          data={data}
          fetchProductData={fetchProductData}
          close={() => setEditOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCardAdmin;
