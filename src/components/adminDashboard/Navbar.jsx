/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import '../../styles/Custom.css';
import { Profile } from './Profile';
import { createItemsNavbar } from '../../utils/CreateItemsNavbar';

export const Navbar = ({ visible, onHide }) => {
	const [activeItem, setActiveItem] = useState('Proyectos');
	const itemsNavbar = createItemsNavbar(onHide, setActiveItem, activeItem);

	return (
		<nav>
			<Sidebar
				visible={visible}
				onHide={onHide}
				baseZIndex={1000}
				className='bg-background'
				style={{ width: '250px' }}>
				<div className='flex flex-row flex-wrap items-center text-xl text-yellow-500 font-bold'>
					<img
						className='mx-3'
						src='/CONSTRU.png'
						width={40}
						alt='Logo de marca'
					/>
					<p>CONSTRUCTOR</p>
				</div>
				<div className='flex flex-col h-[85vh]'>
					<div className='flex-grow'>
						<Menu model={itemsNavbar} className='mt-5' />
					</div>
					<Profile />
				</div>
			</Sidebar>
		</nav>
	);
};

export default Navbar;
