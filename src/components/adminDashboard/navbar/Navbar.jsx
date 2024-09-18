/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import '../../../styles/Custom.css';
import { createItemsNavbar } from '../../../utils/CreateItemsNavbar';

export const Navbar = ({ visible, onHide, setVisible }) => {
	const [activeItem, setActiveItem] = useState('Proyectos');
	const itemsNavbar = createItemsNavbar(onHide, setActiveItem, activeItem);

	return (
		<nav className='bg-background'>
			<Sidebar
				visible={visible}
				onHide={onHide}
				baseZIndex={1000}
				style={{ width: '250px' }}>
				<div className='flex flex-row flex-wrap items-center justify-center text-xl text-[#ffd52b] font-bold'>
					<img
						className='mx-3'
						src='/CONSTRU.png'
						width={50}
						alt='Logo de marca'
					/>
					<p className=''>CONSTRUCTOR</p>
				</div>
				<div className='flex flex-col h-[85vh]'>
					<div className='flex-grow'>
						<Menu model={itemsNavbar} className='mt-5' />
					</div>
				</div>
			</Sidebar>
		</nav>
	);
};

export default Navbar;
