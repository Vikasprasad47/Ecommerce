import React from 'react';
import { IoClose } from "react-icons/io5";

const AddfieldComponent = ({ close, fieldName, fieldValue, onNameChange, onValueChange, submit }) => {
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/50 popupmodel flex items-center justify-center p-6 z-50'>
      <div className='bg-white rounded p-4 w-full max-w-md'>
        <div className='flex items-center justify-between gap-3'>
          <h1 className='font-semibold'>Add Specification Field</h1>
          <button onClick={close} className='hover:text-red-600 cursor-pointer'>
            <IoClose size={22} />
          </button>
        </div>

        <input
          className='bg-gray-200 mt-4 mb-2 p-2 border outline-none focus:border-amber-400 rounded w-full'
          type="text"
          placeholder='Enter Field Name (e.g., Material, Brand)'
          value={fieldName}
          onChange={onNameChange}
        />

        <input
          className='bg-gray-200 mb-4 p-2 border outline-none focus:border-amber-400 rounded w-full'
          type="text"
          placeholder='Enter Field Value (e.g., Cotton, Samsung)'
          value={fieldValue}
          onChange={onValueChange}
        />

        <button
          onClick={submit}
          className='bg-amber-400 px-4 py-2 rounded mx-auto w-fit block hover:bg-amber-300'
        >
          Add
        </button>
      </div>
    </section>
  );
};

export default AddfieldComponent;
