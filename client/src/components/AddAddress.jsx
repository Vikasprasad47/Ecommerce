// import React, { useState, useEffect } from "react";
// import { MdOutlineAddHomeWork, MdClose } from "react-icons/md";
// import { useForm } from "react-hook-form";
// import SummaryApi from "../comman/summaryApi";
// import Axios from "../utils/axios";
// import toast from "react-hot-toast";
// import AxiosToastError from "../utils/AxiosToastErroe";
// import { useGlobalContext } from "../provider/globalProvider";

// const AddAddress = ({ close }) => {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm();

//   const [addressType, setAddressType] = useState("Home");
//   const {fetchAddress} = useGlobalContext()

//   const onSubmit = async (data) => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.createAddress,
//         data: {
//           address_line: data.addressline,
//           landMark: data.landMark,
//           city: data.city,
//           state: data.state,
//           pincode: data.pincode,
//           country: data.country,
//           mobile: data.phoneNumber,
//           address_type: data.addressType
//         }
//       })

//       const {data : responseData} = response

//       if(responseData.success){
//         toast.dismiss()
//         toast.success(responseData.message)
//         if(close){
//           close()
//           reset()
//           fetchAddress()
//         }
//       }
//     } catch (error) {
//       AxiosToastError(error)
//     }
//   };

//   // Auto-fetch city/state based on pincode
//   const pincode = watch("pincode");
//   useEffect(() => {
//     if (pincode?.length === 6 && /^[1-9][0-9]{5}$/.test(pincode)) {
//       fetch(`https://api.postalpincode.in/pincode/${pincode}`)
//         .then(res => res.json())
//         .then(data => {
//           const info = data[0]?.PostOffice?.[0];
//           if (info) {
//             setValue("city", info.District);
//             setValue("state", info.State);
//             setValue("country", info.Country);
//           }
//         });
//     }
//   }, [pincode]);

//   return (
//     <section className="fixed inset-0 popupmodel bg-neutral-800/60 flex justify-center items-center p-4">
//       <div className="relative bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl max-h-[75vh] lg:max-h-[95vh] overflow-y-auto no-scrollbar">
        
//         {/* Header with Close Button */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-3">
//             <MdOutlineAddHomeWork className="text-2xl text-amber-500" />
//             <h2 className="text-lg font-semibold text-gray-800">Add New Address</h2>
//           </div>
//           <button
//             className="text-gray-400 hover:text-gray-600 cursor-pointer"
//             onClick={close}
//             aria-label="Close form"
//           >
//             <MdClose className="text-xl" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//           {/* Address Line */}
//           <div className="sm:col-span-2">
//             <label className="text-sm font-medium">Address Line</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.addressline ? "border-red-500" : "border-gray-300"}`}
//               {...register("addressline", { required: "Address line is required" })}
//             />
//             {errors.addressline && <p className="text-xs text-red-500">{errors.addressline.message}</p>}
//           </div>

//           {/* Landmark */}
//           <div>
//             <label className="text-sm font-medium">Landmark</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.landMark ? "border-red-500" : "border-gray-300"}`}
//               {...register("landMark", { required: "Landmark is required" })}
//             />
//             {errors.landMark && <p className="text-xs text-red-500">{errors.landMark.message}</p>}
//           </div>

//           {/* Phone Number */}
//           <div>
//             <label className="text-sm font-medium">Phone Number</label>
//             <input
//               type="tel"
//               inputMode="numeric"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
//               {...register("phoneNumber", {
//                 required: "Phone number is required",
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: "Must be 10 digits",
//                 },
//               })}
//             />
//             {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
//           </div>

//           {/* Pincode */}
//           <div>
//             <label className="text-sm font-medium">Pincode</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
//               {...register("pincode", {
//                 required: "Pincode is required",
//                 pattern: {
//                   value: /^[1-9][0-9]{5}$/,
//                   message: "Invalid pincode",
//                 },
//               })}
//             />
//             {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
//           </div>

//           {/* City */}
//           <div>
//             <label className="text-sm font-medium">City</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.city ? "border-red-500" : "border-gray-300"}`}
//               {...register("city", { required: "City is required" })}
//             />
//             {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
//           </div>

//           {/* State */}
//           <div>
//             <label className="text-sm font-medium">State</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.state ? "border-red-500" : "border-gray-300"}`}
//               {...register("state", { required: "State is required" })}
//             />
//             {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
//           </div>

//           {/* Country */}
//           <div>
//             <label className="text-sm font-medium">Country</label>
//             <input
//               type="text"
//               className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${errors.country ? "border-red-500" : "border-gray-300"}`}
//               {...register("country", { required: "Country is required" })}
//             />
//             {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
//           </div>

//           {/* Custom Address Type Selector */}
//           <div className="sm:col-span-2">
//             <label className="text-sm font-medium mb-1 block">Address Type</label>
//             <div className="flex gap-3">
//               {["Home", "Work", "Other"].map((type) => (
//                 <button
//                   type="button"
//                   key={type}
//                   className={`flex-1 border px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
//                     addressType === type
//                       ? "bg-amber-500 text-white border-amber-500"
//                       : "bg-white border-gray-300 text-gray-700 hover:border-amber-500"
//                   }`}
//                   onClick={() => setAddressType(type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="sm:col-span-2">
//             <button
//               type="submit"
//               className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg mt-2 transition-all"
//             >
//               Submit Address
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AddAddress;


import React, { useState, useEffect } from "react";
import { MdOutlineAddHomeWork, MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/axios";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastErroe";
import { useGlobalContext } from "../provider/globalProvider";

const AddAddress = ({ close }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [addressType, setAddressType] = useState("Home");
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          landMark: data.landMark,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
          mobile: data.phoneNumber,
          address_type: addressType,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.dismiss();
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress && fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Auto-fetch city/state/country based on pincode
  const pincode = watch("pincode");
  useEffect(() => {
    if (pincode?.length === 6 && /^[1-9][0-9]{5}$/.test(pincode)) {
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
          const info = data[0]?.PostOffice?.[0];
          if (info) {
            setValue("city", info.District);
            setValue("state", info.State);
            setValue("country", info.Country);
          }
        });
    }
  }, [pincode]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/60 p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <MdOutlineAddHomeWork className="text-2xl text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">Add New Address</h2>
          </div>
          <button
            onClick={close}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close form"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address Line */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Address Line</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.addressline ? "border-red-500" : "border-gray-300"
              }`}
              {...register("addressline", { required: "Address line is required" })}
            />
            {errors.addressline && <p className="text-xs text-red-500">{errors.addressline.message}</p>}
          </div>

          {/* Landmark */}
          <div>
            <label className="text-sm font-medium">Landmark</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.landMark ? "border-red-500" : "border-gray-300"
              }`}
              {...register("landMark", { required: "Landmark is required" })}
            />
            {errors.landMark && <p className="text-xs text-red-500">{errors.landMark.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              inputMode="numeric"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
              })}
            />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          {/* Pincode */}
          <div>
            <label className="text-sm font-medium">Pincode</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.pincode ? "border-red-500" : "border-gray-300"
              }`}
              {...register("pincode", {
                required: "Pincode is required",
                pattern: { value: /^[1-9][0-9]{5}$/, message: "Invalid pincode" },
              })}
            />
            {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="text-sm font-medium">State</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
              {...register("state", { required: "State is required" })}
            />
            {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="text-sm font-medium">Country</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
          </div>

          {/* Address Type Selector */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1 block">Address Type</label>
            <div className="flex gap-3 flex-wrap">
              {["Home", "Work", "Other"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`flex-1 min-w-[80px] text-center border px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    addressType === type
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white border-gray-300 text-gray-700 hover:border-amber-500"
                  }`}
                  onClick={() => setAddressType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg mt-2 transition-all"
            >
              Submit Address
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
