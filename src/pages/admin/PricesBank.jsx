import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../../hooks/useUserActions';
import { AccordionPrices } from '../../components/adminDashboard/pricesBank/myBank/AccordionPrices';

export const PricesBank = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredUsers, setFilteredUsers] = useState([]);
	const navigate = useNavigate();
	const { users } = useUserActions();

	useEffect(() => {
		if (searchQuery) {
			const filtered = users.filter(
				(user) =>
					user.displayName
						?.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.cel?.includes(searchQuery)
			);
			setFilteredUsers(filtered);
		} else {
			setFilteredUsers(users);
		}
	}, [searchQuery, users]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/clients?search=${searchQuery}`);
	};

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between my-3 mx-2'>
				<h1 className='title'>Mi Banco de Precios</h1>
				<div className='flex flex-wrap items-center justify-center md:justify-end w-full sm:w-auto mt-3 sm:mt-0'>
					<form
						onSubmit={handleSearchSubmit}
						className='flex items-center justify-center'>
						<input
							type='text'
							placeholder='Buscar...'
							className='w-full px-2 py-1 bg-white border-1 border-yellow-500 text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#61dafb]'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							type='submit'
							className='ml-2 bg-[#ffd52b] hover:bg-[#fde047] duration-200 text-black px-3 py-2 rounded-md focus:outline-none'>
							<i className='pi pi-search font-bold'></i>
						</button>
					</form>
				</div>
			</div>
			<AccordionPrices users={filteredUsers} />
		</div>
	);
};
