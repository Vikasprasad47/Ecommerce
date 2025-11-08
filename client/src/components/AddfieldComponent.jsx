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


import React from 'react';
import { IoClose } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";

const AddfieldComponent = ({ 
  close, 
  fieldName, 
  fieldValue, 
  onNameChange, 
  onValueChange, 
  submit 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fieldName.trim()) {
      alert('Please enter a field name');
      return;
    }
    submit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-xl">
              <MdOutlineDescription className="text-amber-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">Add Specification</h2>
              <p className="text-sm text-gray-600">Add a new product specification</p>
            </div>
          </div>
          <button 
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <IoClose size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Field Name
            </label>
            <input
              type="text"
              placeholder="e.g., Material, Brand, Weight"
              value={fieldName}
              onChange={onNameChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition placeholder-gray-400"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Descriptive name for the specification
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Field Value
            </label>
            <input
              type="text"
              placeholder="e.g., Cotton, Samsung, 500g"
              value={fieldValue}
              onChange={onValueChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Value or description for the specification
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
            >
              Add Specification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddfieldComponent;