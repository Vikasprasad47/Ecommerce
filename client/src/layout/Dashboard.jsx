import React, { useRef } from 'react'
import UserMenu from '../components/userMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const rightContainerRef = useRef(null)

  return (
    <section className='bg-gradient-to-br from-amber-50 to-orange-50/70 py-4 px-2 md:p-2 h-auto w-full'>
      <div className="lg:container lg:max-w-[1440px] lg:px-3 md:grid lg:grid-cols-[250px_1fr] gap-4">
        
        {/* Left menu */}
        <div className='hidden lg:block sticky top-18 h-fit self-start'>
          <UserMenu rightContainerRef={rightContainerRef} />
        </div>


        {/* Right container */}
        <div
          className=''
          ref={rightContainerRef}
        >
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default Dashboard
