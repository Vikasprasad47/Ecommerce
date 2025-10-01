import React from 'react'
import noDataImg from '../assets/nothing here yet.webp'

const Nodata = () => {
  return (
    <div className='flex flex-col justify-center items-center py-3 gap-2'>
        <img 
            src={noDataImg} 
            alt="No Data"
            className='w-36'
        />
        <p className='text-neutral-600'>No Data Avilable..</p>
    </div>
  )
}

export default Nodata
