import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import UploadCategoryModels from '../components/UploadCategoryModels'
import Loading from '../components/Loading'
import Nodata from '../components/Nodata'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import EditCategory from '../components/EditCategory'
import Confirmbox from '../components/Confirmbox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-md p-3 w-39 max-[375px]:w-35 lg:w-40 animate-pulse">
    <div className="w-28 h-28 bg-gray-200 rounded-md mx-auto"></div>
    <div className="h-4 bg-gray-300 mt-3 rounded w-3/4 mx-auto"></div>
    <div className="flex w-full gap-2 mt-2">
      <div className="flex-1 h-6 bg-gray-300 rounded"></div>
      <div className="flex-1 h-6 bg-gray-300 rounded"></div>
    </div>
  </div>
)

const Categorypage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [openUploadCategory, setopenUploadCategory] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState({ _id: "" })
  const [editData, setEditData] = useState({ name: "", image: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getCategory })
      const { data: responseData } = response
      if (responseData.success) {
        setCategoryData(responseData.data)
        const query = new URLSearchParams(location.search)
        const term = query.get("search") || ""
        setSearchTerm(term)
        filterData(responseData.data, term)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const handelDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deletecategory,
        data: deleteCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        toast.dismiss();
        toast.success(responseData.message)
        fetchCategory()
        setOpenConfirmBoxDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const filterData = (data, term) => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredData(filtered)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    navigate(`?search=${value}`)
    filterData(categoryData, value)
  }

  const highlightMatch = (text, highlight) => {
    if (!highlight) return text
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-black">{part}</mark>
      ) : part
    )
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <section>
      <div className="shadow-md px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl text-neutral-800">
          Category Page
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-around sm:justify-end">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search category..."
            className="text-sm border px-3 py-2 rounded-md outline-none w-50 sm:w-52"
          />
          <button
            onClick={() => setopenUploadCategory(true)}
            className="text-sm border-amber-400 bg-yellow-400 hover:bg-green-500 hover:text-black px-3 py-2 rounded"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Count Display */}
      <div className="px-6 py-2 text-sm text-gray-600">
        Total Categories: {categoryData.length} | Showing: {filteredData.length}
      </div>

      {!filteredData[0] && !loading && <Nodata />}

      <div className="py-4 m-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-5">
        {
          loading
            ? Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonCard key={i} />)
            : paginatedData.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center w-39 max-[375px]:w-35 lg:w-40">
                <div className="w-28 h-28 flex justify-center items-center overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-700 text-center line-clamp-1">
                  {highlightMatch(category.name, searchTerm)}
                </p>
                <div className="flex w-full gap-2 mt-2">
                  <button
                    onClick={() => {
                      setOpenEdit(true)
                      setEditData(category)
                    }}
                    className="flex-1 text-sm font-medium bg-green-200 text-gray-700 py-1 rounded-md hover:bg-green-300 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteCategory(category)
                      setOpenConfirmBoxDelete(true)
                    }}
                    className="flex-1 text-sm font-medium bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        }
      </div>

      {/* Pagination Controls */}
      {
        totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>
            {
              Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded text-sm ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))
            }
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )
      }

      {openUploadCategory && <UploadCategoryModels fetchData={fetchCategory} close={() => setopenUploadCategory(false)} />}
      {openEdit && <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />}
      {openConfirmBoxDelete && <Confirmbox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handelDeleteCategory} />}
    </section>
  )
}

export default Categorypage
