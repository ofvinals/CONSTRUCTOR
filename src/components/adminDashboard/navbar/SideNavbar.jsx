import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/Custom.css';
import { Profile } from './Profile';
import { Link } from 'react-router-dom';
import { ItemsNavbar } from '../../../utils/ItemsNavbar';

export const SideNavbar = () => {
	const [activeItem, setActiveItem] = useState('Presupuestos');
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const { loggedUser } = useAuth();

	const handleMouseEnter = () => {
		if (loggedUser) {
			setSidebarVisible(true);
		}
	};

	const handleMouseLeave = () => {
		setSidebarVisible(false);
	};

	const handleItemClick = (label) => {
		setActiveItem(label);
		setSidebarVisible(false);
	};

	return loggedUser ? (
		<div
			className={`relative flex flex-col border-r items-center h-full border-[#cccccc] bg-[#cccccc] transition-all duration-300 ${
				sidebarVisible ? 'w-16' : 'w-16'
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<div className='hover:opacity-70 duration-200 my-4 mx-2'>
				<img src='/CONSTRU.png' alt='' width={50} />
			</div>
			<div className='flex flex-col items-center justify-center '>
				<div className='flex flex-col gap-4'>
					{ItemsNavbar.map((item, index) => (
						<Link
							key={index}
							className='p-2 flex items-center'
							to={item.path}
							onClick={() => handleItemClick(item.label)}>
							<i
								className={`pi ${
									item.icon
								} font-bold p-2 rounded-lg hover:bg-[#ffd52b] ${
									activeItem === item.label ? 'bg-[#ffd52b]' : ''
								}`}></i>
						</Link>
					))}
				</div>
				<div className='mt-10'>
					<Profile setSidebarVisible={sidebarVisible} />
				</div>
				<div
					className={`absolute flex flex-col h-full left-full pt-16 bg-[#cccccc] text-black font-semibold rounded-md px-2 whitespace-nowrap ${
						sidebarVisible ? 'block' : 'hidden'
					}`}
					style={{
						width: '200px',
						top: 0,
						zIndex: 1001,
					}}>
					{ItemsNavbar.map((item, index) => (
						<Link
							key={index}
							onClick={() => handleItemClick(item.label)}
							to={item.path}
							className={`py-2 mt-8 rounded-md hover:font-bold ${
								activeItem === item.label ? 'font-extrabold' : ''
							}`}>
							{item.label}
						</Link>
					))}
					<p className='font-semibold text-wrap mt-[72px]'>
						{loggedUser.displayName}
					</p>
				</div>
			</div>
		</div>
	) : null;
};
