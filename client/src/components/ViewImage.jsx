import React from 'react'
import { IoClose } from "react-icons/io5";

const ViewImage = ({url, close}) => {
  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-md flex justify-center items-center z-[801] transition-opacity duration-300">
        <div className="relative w-[85%] sm:w-[70%] md:w-[60%] lg:w-[40%] bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-lg">
            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition duration-200 cursor-pointer"
            >
              <IoClose size={22} />
            </button>

            {/* Image */}
            <img
              src={url}
              alt="full screen"
              className="w-full max-h-[50vh] sm:max-h-[40vh] md:max-h-[45vh] lg:max-h-[60vh] object-scale-down rounded-lg"
            />
        </div>
    </div>

  )
}

export default ViewImage
