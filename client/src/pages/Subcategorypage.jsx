import React, { useEffect, useState } from 'react';
import UploadSubCategoryModel from '../components/UploadSubCategoryModel';
import AxiosToastError from '../utils/AxiosToastErroe';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import DisplayTable from '../components/DisplayTable';
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from '../components/ViewImage';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory';
import Confirmbox from '../components/Confirmbox';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';

const Subcategorypage = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const columnHelper = createColumnHelper();
    const [ImageUrl, setImageUrl] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        _id: ""
    });
    const [deleteSubCategory, setDeleteSubCategory] = useState({
        _id: ""
    });
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

    const fetchSubCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getSubCategory
            });
            const { data: responseData } = response;

            if (responseData.success) {
                setData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubCategory();
    }, []);

    const column = [
        columnHelper.accessor('name', {
            header: "Name",
            cell: ({ row }) => (
                <span className="font-medium text-gray-800">
                    {row.original.name}
                </span>
            )
        }),
        columnHelper.accessor('image', {
            header: "Image",
            cell: ({ row }) => {
                return (
                    <div className='flex justify-center items-center'>
                        <img
                            src={row.original.image}
                            alt={row.original.name}
                            className='w-12 h-12 cursor-pointer rounded-lg object-cover border border-gray-200 hover:shadow-md transition'
                            onClick={() => {
                                setImageUrl(row.original.image);
                            }}
                        />
                    </div>
                );
            }
        }),
        columnHelper.accessor("category", {
            header: "Categories",
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {
                            row.original.category?.map((c) => {
                                return (
                                    <span 
                                        key={c._id + 'tabel'} 
                                        className='bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center'
                                    >
                                        {c.name}
                                    </span>
                                );
                            })
                        }
                    </div>
                );
            }
        }),
        columnHelper.accessor('_id', {
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                            onClick={() => {
                                setOpenEdit(true);
                                setEditData(row.original);
                            }}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 shadow-sm"
                            title="Edit"
                        >
                            <FaRegEdit size={16} />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => {
                                setOpenDeleteConfirmBox(true);
                                setDeleteSubCategory(row.original);
                            }}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 shadow-sm"
                            title="Delete"
                        >
                            <MdOutlineDeleteOutline size={16} />
                        </button>
                    </div>
                );
            }
        })
    ];

    const handelDeleteSubCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteSubCategory,
                data: deleteSubCategory
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.dismiss();
                toast.success(responseData.message);
                fetchSubCategory();
                setOpenDeleteConfirmBox(false);
                setDeleteSubCategory({ _id: "" });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Subcategories</h2>
                            <p className="text-gray-600 mt-1 text-sm">Manage all product subcategories</p>
                        </div>
                        <button 
                            onClick={() => setOpenAddSubCategory(true)} 
                            className="flex items-center gap-2 text-sm border border-amber-500 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg transition shadow-sm"
                        >
                            <FiPlus size={18} />
                            Add Subcategory
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <DisplayTable
                        data={data}
                        column={column}
                        loading={loading}
                    />
                </div>

                {/* Modals */}
                {openAddSubCategory && (
                    <UploadSubCategoryModel
                        close={() => setOpenAddSubCategory(false)}
                        fetchData={fetchSubCategory}
                    />
                )}

                {ImageUrl && (
                    <ViewImage url={ImageUrl} close={() => setImageUrl("")} />
                )}

                {openEdit && (
                    <EditSubCategory
                        data={editData}
                        close={() => setOpenEdit(false)}
                        fetchData={fetchSubCategory}
                    />
                )}

                {openDeleteConfirmBox && (
                    <Confirmbox
                        cancel={() => setOpenDeleteConfirmBox(false)}
                        close={() => setOpenDeleteConfirmBox(false)}
                        confirm={handelDeleteSubCategory}
                    />
                )}
            </div>
        </section>
    );
};

export default Subcategorypage;