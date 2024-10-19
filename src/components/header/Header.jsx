import { useEffect } from 'react';
import { DateTime } from './Date';
import { Link, useLocation } from 'react-router-dom';
import { menuOptions } from '../../utils/HeaderOptions';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
	const location = useLocation();

	useEffect(() => {}, [location]);

	const isBudgetRoute = location.pathname.startsWith('/proyects');

	const currentMenuOptions = isBudgetRoute
		? menuOptions['/proyects/budget']
		: menuOptions[location.pathname] || [];
	const { loggedUser } = useAuth();

	return (
		<header className='bg-[#cccccc] text-white '>
			<section className='flex items-center  justify-around md:justify-between flex-wrap flex-row sm:pb-0 px-4 mx-auto min-h-[9vh]'>
				{!loggedUser ? (
					<div className='flex flex-row flex-wrap items-center justify-center text-xl text-[#ffd52b] font-bold'>
						<img
							className='mx-3'
							src='/CONSTRU.png'
							width={50}
							alt='Logo de marca'
						/>
					</div>
				) : null}
				<div className='flex flex-row flex-wrap m-2 space-x-4 items-center lg:w-9/12 justify-center lg:justify-start'>
					{currentMenuOptions.map((option) => (
						<Link
							key={option.path}
							to={option.path}
							className={`flex justify-center text-center items-center hover:text-yellow-300 text-black hover:border-b-2 hover:border-blue-500 ${
								location.pathname === option.path
									? 'font-bold border-b-2 border-blue-500'
									: 'text-wrap'
							} ${option.icon ? 'w-10 mt-1' : 'text-wrap'}`}>
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
