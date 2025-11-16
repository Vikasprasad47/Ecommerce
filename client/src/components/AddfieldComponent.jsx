// import React from 'react';
// import { IoClose } from "react-icons/io5";

// const AddfieldComponent = ({ close, fieldName, fieldValue, onNameChange, onValueChange, submit }) => {
//   return (
//     <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/50 popupmodel flex items-center justify-center p-6 z-50'>
//       <div className='bg-white rounded p-4 w-full max-w-md'>
//         <div className='flex items-center justify-between gap-3'>
//           <h1 className='font-semibold'>Add Specification Field</h1>
//           <button onClick={close} className='hover:text-red-600 cursor-pointer'>
//             <IoClose size={22} />
//           </button>
//         </div>

//         <input
//           className='bg-gray-200 mt-4 mb-2 p-2 border outline-none focus:border-amber-400 rounded w-full'
//           type="text"
//           placeholder='Enter Field Name (e.g., Material, Brand)'
//           value={fieldName}
//           onChange={onNameChange}
//         />

//         <input
//           className='bg-gray-200 mb-4 p-2 border outline-none focus:border-amber-400 rounded w-full'
//           type="text"
//           placeholder='Enter Field Value (e.g., Cotton, Samsung)'
//           value={fieldValue}
//           onChange={onValueChange}
//         />

//         <button
//           onClick={submit}
//           className='bg-amber-400 px-4 py-2 rounded mx-auto w-fit block hover:bg-amber-300'
//         >
//           Add
//         </button>
//       </div>
//     </section>
//   );
// };

// export default AddfieldComponent;


// import React from 'react';
// import { IoClose } from "react-icons/io5";
// import { MdOutlineDescription } from "react-icons/md";

// const AddfieldComponent = ({ 
//   close, 
//   fieldName, 
//   fieldValue, 
//   onNameChange, 
//   onValueChange, 
//   submit 
// }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!fieldName.trim()) {
//       alert('Please enter a field name');
//       return;
//     }
//     submit();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-amber-50 rounded-xl">
//               <MdOutlineDescription className="text-amber-600 text-xl" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-gray-800 text-lg">Add Specification</h2>
//               <p className="text-sm text-gray-600">Add a new product specification</p>
//             </div>
//           </div>
//           <button 
//             onClick={close}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
//           >
//             <IoClose size={24} className="text-gray-500 hover:text-gray-700" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Field Name
//             </label>
//             <input
//               type="text"
//               placeholder="e.g., Material, Brand, Weight"
//               value={fieldName}
//               onChange={onNameChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition placeholder-gray-400"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Descriptive name for the specification
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Field Value
//             </label>
//             <input
//               type="text"
//               placeholder="e.g., Cotton, Samsung, 500g"
//               value={fieldValue}
//               onChange={onValueChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition placeholder-gray-400"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Value or description for the specification
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={close}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
//             >
//               Add Specification
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddfieldComponent;

import React from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";

const AddfieldComponent = ({
  close,
  fieldName,
  fieldValue,
  onNameChange,
  onValueChange,
  submit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return alert("Please enter a field name");
    submit();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[300]">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white/95 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
              <MdOutlineDescription className="text-amber-600 text-xl" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">Add Specification</h2>
              <p className="text-xs text-slate-500">Create a new detail field</p>
            </div>
          </div>

          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Field Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Field Name
            </label>

            <input
              type="text"
              placeholder="e.g., Material, Capacity, Flavor"
              value={fieldName}
              onChange={onNameChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <p className="text-[11px] text-slate-500 mt-1">
              This will appear as the label in product details.
            </p>
          </div>

          {/* Field Value */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Field Value
            </label>

            <input
              type="text"
              placeholder="e.g., Cotton, 1kg, Mint Flavor"
              value={fieldValue}
              onChange={onValueChange}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />

            <p className="text-[11px] text-slate-500 mt-1">
              Enter the actual specification value.
            </p>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
            >
              Add Field
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddfieldComponent;
