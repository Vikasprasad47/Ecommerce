import React from 'react'
import UserMenu from '../components/userMenu'
import { IoCloseSharp } from "react-icons/io5";

const UserMenuMobile = () => {
	return (
		<section className='bg-white h-full w-full py-2'>
			<div className='container mx-auto px-5 py-5 pb-8'>
				<UserMenu/>
			</div>
		</section>
	)
}

export default UserMenuMobile
