import React, { useState } from 'react'
import { MdOutlineAddBusiness, MdDelete, MdEditDocument } from 'react-icons/md'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import AddAddress from '../components/AddAddress'
import EditAddressDetails from '../components/EditAddressDetails'
import Axios from '../utils/axios'
import SummaryApi from '../comman/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastErroe'
import { useGlobalContext } from '../provider/globalProvider'

const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEditAddress, setOpenEditAddress] = useState(false)
  const [editData, setEditData] = useState({})
  const {fetchAddress} = useGlobalContext()


  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id
        }
      })

      if(response.data.success){
        toast.dismiss();
        toast.success('Address Removed successfully')
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  } 

  return (
    <div className="px-3 py-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl">
      <div className='flex items-center justify-between mb-3 bg-white px-3 py-4 rounded-lg shadow-sm'>
        <h3 className="lg:text-3xl text-lg font-bold text-gray-900">Saved Addresses</h3>
        <button
          onClick={() => setOpenAddress(true)}
          className='bg-amber-500 text-white text-sm cursor-pointer font-medium px-4 py-2 rounded-xl hover:bg-amber-600 transition shadow-sm'
        >
          + Add Address
        </button>
      </div>

      <div className="grid gap-3">
        {addressList.length > 0 ? (
          addressList.map((address, index) => (
            <div
              key={index}
              className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition  ${!address.status ? 'hidden' : ''}`}
            >
              <div className={`flex items-center gap-4 text-gray-800`}>
                <div className="text-blue-500 mt-1.5">
                  <FaMapMarkerAlt className="text-xl" />
                </div>

                <div className="flex-1 space-y-1 text-sm leading-relaxed">
                  <p className="text-base font-medium text-gray-900">
                    {address.address_line}, {address.city}, {address.state} – {address.pincode}, {address.country}
                  </p>

                  {address.landMark && (
                    <p className="text-gray-600">
                      <span className="font-medium">Landmark:</span> {address.landMark}
                    </p>
                  )}

                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {address.mobile}
                    <span className="mx-2">•</span>
                    <span className="capitalize">
                      <span className="font-medium">Type:</span> {address.address_type}
                    </span>
                  </p>
                </div>

                <div className='flex flex-col gap-2 items-end'>
                  <button
                    onClick={() => {
                      setOpenEditAddress(true)
                      setEditData(address)
                    }}
                    className=' cursor-pointer bg-green-100 hover:bg-green-200 p-2 rounded-lg transition'
                    title="Edit"
                  >
                    <MdEditDocument size={18} />
                  </button>
                  <button
                    onClick={() => handleDisableAddress(address._id)}
                    className='cursor-pointer bg-red-100 hover:bg-red-200 p-2 rounded-lg transition'
                    title="Delete"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic py-8 text-sm">
            You haven’t added any addresses yet.
          </div>
        )}

        {/* Add New Address Card */}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-32 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
        >
          <MdOutlineAddBusiness className="text-4xl" />
          <span className="text-base font-semibold">Add New Address</span>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      
      {
        openEditAddress && (
          <EditAddressDetails data={editData} close={()=>setOpenEditAddress(false)}/>
        )
      }
    </div>
  )
}

export default Address
