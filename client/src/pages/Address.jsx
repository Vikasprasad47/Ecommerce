// import React, { useState } from 'react'
// import { MdOutlineAddBusiness, MdDelete, MdEditDocument } from 'react-icons/md'
// import { FaMapMarkerAlt } from 'react-icons/fa'
// import { useSelector } from 'react-redux'
// import AddAddress from '../components/AddAddress'
// import EditAddressDetails from '../components/EditAddressDetails'
// import Axios from '../utils/axios'
// import SummaryApi from '../comman/summaryApi'
// import toast from 'react-hot-toast'
// import AxiosToastError from '../utils/AxiosToastErroe'
// import { useGlobalContext } from '../provider/globalProvider'

// const Address = () => {
//   const addressList = useSelector(state => state.addresses.addressList)
//   const [openAddress, setOpenAddress] = useState(false)
//   const [openEditAddress, setOpenEditAddress] = useState(false)
//   const [editData, setEditData] = useState({})
//   const {fetchAddress} = useGlobalContext()


//   const handleDisableAddress = async (id) => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.disableAddress,
//         data: {
//           _id: id
//         }
//       })

//       if(response.data.success){
//         toast.dismiss();
//         toast.success('Address Removed successfully')
//         if(fetchAddress){
//           fetchAddress()
//         }
//       }
//     } catch (error) {
//       AxiosToastError(error)
//     }
//   } 

//   return (
//     <div className="px-3 py-3 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl">
//       <div className='flex items-center justify-between mb-3 bg-white px-3 py-4 rounded-lg shadow-sm'>
//         <h3 className="lg:text-3xl text-lg font-bold text-gray-900">Saved Addresses</h3>
//         <button
//           onClick={() => setOpenAddress(true)}
//           className='bg-amber-500 text-white text-sm cursor-pointer font-medium px-4 py-2 rounded-xl hover:bg-amber-600 transition shadow-sm'
//         >
//           + Add Address
//         </button>
//       </div>

//       <div className="grid gap-3">
//         {addressList.length > 0 ? (
//           addressList.map((address, index) => (
//             <div
//               key={index}
//               className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition  ${!address.status ? 'hidden' : ''}`}
//             >
//               <div className={`flex items-center gap-4 text-gray-800`}>
//                 <div className="text-blue-500 mt-1.5">
//                   <FaMapMarkerAlt className="text-xl" />
//                 </div>

//                 <div className="flex-1 space-y-1 text-sm leading-relaxed">
//                   <p className="text-base font-medium text-gray-900">
//                     {address.address_line}, {address.city}, {address.state} – {address.pincode}, {address.country}
//                   </p>

//                   {address.landMark && (
//                     <p className="text-gray-600">
//                       <span className="font-medium">Landmark:</span> {address.landMark}
//                     </p>
//                   )}

//                   <p className="text-gray-700">
//                     <span className="font-medium">Phone:</span> {address.mobile}
//                     <span className="mx-2">•</span>
//                     <span className="capitalize">
//                       <span className="font-medium">Type:</span> {address.address_type}
//                     </span>
//                   </p>
//                 </div>

//                 <div className='flex flex-col gap-2 items-end'>
//                   <button
//                     onClick={() => {
//                       setOpenEditAddress(true)
//                       setEditData(address)
//                     }}
//                     className=' cursor-pointer bg-green-100 hover:bg-green-200 p-2 rounded-lg transition'
//                     title="Edit"
//                   >
//                     <MdEditDocument size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDisableAddress(address._id)}
//                     className='cursor-pointer bg-red-100 hover:bg-red-200 p-2 rounded-lg transition'
//                     title="Delete"
//                   >
//                     <MdDelete size={20} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 italic py-8 text-sm">
//             You haven’t added any addresses yet.
//           </div>
//         )}

//         {/* Add New Address Card */}
//         <div
//           onClick={() => setOpenAddress(true)}
//           className="h-32 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
//         >
//           <MdOutlineAddBusiness className="text-4xl" />
//           <span className="text-base font-semibold">Add New Address</span>
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      
//       {
//         openEditAddress && (
//           <EditAddressDetails data={editData} close={()=>setOpenEditAddress(false)}/>
//         )
//       }
//     </div>
//   )
// }

// export default Address


import React, { useState, useMemo, memo } from 'react'
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
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({ ...SummaryApi.disableAddress, data: { _id: id } })
      if (response.data.success) {
        toast.dismiss()
        toast.success('Address removed successfully')
        fetchAddress && fetchAddress()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const AddressRows = useMemo(() => {
    return addressList
      .filter(addr => addr.status)
      .map(address => (
        <AddressRow
          key={address._id}
          address={address}
          onEdit={() => {
            setOpenEditAddress(true)
            setEditData(address)
          }}
          onDelete={() => handleDisableAddress(address._id)}
        />
      ))
  }, [addressList])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-xl text-gray-800">Saved Addresses</h2>
          <button
            onClick={() => setOpenAddress(true)}
            className="bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-amber-600 transition shadow-sm mt-2 sm:mt-0"
          >
            + Add Address
          </button>
        </div>

        {/* Address Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="flex items-center justify-center px-6 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {AddressRows.length > 0 ? (
                AddressRows
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 py-6">
                    You haven’t added any addresses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Address Button */}
        <div
          onClick={() => setOpenAddress(true)}
          className="mt-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition py-6"
        >
          <MdOutlineAddBusiness className="text-4xl" />
          <span className="text-base font-semibold">Add New Address</span>
        </div>

        {/* Modals */}
        {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
        {openEditAddress && <EditAddressDetails data={editData} close={() => setOpenEditAddress(false)} />}
      </div>
    </div>
  )
}

// Single address row component (memoized)
const AddressRow = memo(({ address, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition">
    <td className="px-6 py-4 text-sm text-gray-800">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{address.address_line}, {address.city}, {address.state} – {address.pincode}, {address.country}</span>
        {address.landMark && <span className="text-gray-600 text-sm">Landmark: {address.landMark}</span>}
        <span className="text-gray-700 text-sm">Type: {address.address_type}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-700">{address.mobile}</td>
    <td className="px-6 py-4 text-right text-sm font-medium flex justify-end gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition text-sm font-medium"
      >
        <MdEditDocument size={18} /> Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition text-sm font-medium"
      >
        <MdDelete size={18} /> Delete
      </button>
    </td>
  </tr>
))

export default Address
