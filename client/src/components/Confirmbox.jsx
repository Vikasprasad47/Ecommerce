import React from 'react'
import { IoClose } from "react-icons/io5";

const Confirmbox = ({cancel, confirm, close}) => {
  return (
    <div className="fixed inset-0 popupmodel bg-neutral-800/60 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-sm p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-lg font-semibold text-red-600">Delete Permanently!</h1>
          <button onClick={close} className="cursor-pointer text-gray-500 hover:text-gray-800">
            <IoClose size={24} />
          </button>
        </div>
        <p className="text-gray-700">Are you sure you want to delete this permanently? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={cancel} className="px-4 py-2 bg-stone-200 rounded text-black hover:bg-green-300 cursor-pointer">Cancel</button>
          <button onClick={confirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
 
  )
}

export default Confirmbox
