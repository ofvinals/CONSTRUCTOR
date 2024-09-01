import { useEffect, useState } from 'react';
import { DateTime } from './Date';
import { useAuth } from '../../hooks/useAuth';
import { Button } from 'primereact/button';
import Navbar from '../adminDashboard/navbar/Navbar';
import { Link, useLocation } from 'react-router-dom';
import { menuOptions } from '../../utils/HeaderOptions';

export function Header() {
	const { loggedUser } = useAuth();
	const location = useLocation();
	const [sidebarVisible, setSidebarVisible] = useState(false);

	const handleMouseEnter = () => {
		if (loggedUser) {
			setSidebarVisible(true);
		}
	};

	const handleMouseLeave = () => {
		setSidebarVisible(false);
	};

	useEffect(() => {}, [location]);

	const currentMenuOptions = menuOptions[location.pathname] || [];

	return (
		<header className='bg-background text-white'>
			<section className='flex items-center w-full justify-around md:justify-between flex-wrap flex-row sm:pb-0 px-4 mx-auto min-h-[100px]'>
				<div
					className='flex items-start justify-start '
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					<Button className='hover:opacity-70 duration-200 my-3 selection:ring-0 focus:ring-0'>
						<img src='/CONSTRUCTOR.png' alt='' width={100} />
					</Button>
					{loggedUser && (
						<div
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}>
							<Navbar
								visible={sidebarVisible}
								onHide={() => setSidebarVisible(false)}
								setVisible={setSidebarVisible}
							/>
						</div>
					)}
				</div>
				<div className='flex flex-row flex-wrap m-2 space-x-4 items-center lg:w-9/12 justify-center lg:justify-start'>
					{currentMenuOptions.map((option) => (
						<Link
							key={option.path}
							to={option.path}
							className={`flex justify-center text-center items-center hover:text-yellow-300 text-black hover:border-b-2 hover:border-blue-500 ${
								option.icon ? 'w-10 mt-1' : 'text-wrap'
							}`}>
							{option.icon && (
								<span className='mr-2 text-center font-bold'>
									{option.icon}
								</span>
							)}
							{option.label}
						</Link>
					))}
				</div>
				<div className='text-black font-semibold flex flex-col text-end flex-wrap items-center justify-center md:items-end'>
					<DateTime />
				</div>
			</section>
		</header>
	);
}
