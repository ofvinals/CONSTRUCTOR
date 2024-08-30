import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { CardClients } from '../../components/adminDashboard/clients/CardClients';
import { TableClients } from '../../components/adminDashboard/clients/TableClients';
import Modals from '../../utils/Modals';
import { FormClients } from '../../components/adminDashboard/clients/FormClients';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../../hooks/useUserActions';

export const Clients = () => {
	const [openCardClients, setOpenCardClients] = useState(true);
	const [openListClients, setOpenListClients] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredUsers, setFilteredUsers] = useState([]);
	const addModal = useModal();
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

	const handleCard = () => {
		setOpenCardClients(true);
		setOpenListClients(false);
	};

	const handleList = () => {
		setOpenCardClients(false);
		setOpenListClients(true);
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/clients?search=${searchQuery}`);
	};

	return (
		<div className='min-h-screen'>
			<div className='flex flex-wrap items-center justify-between my-3 mx-2'>
				<h1 className='title'>Clientes</h1>
				<div className='flex flex-wrap items-center justify-center md:justify-end w-full sm:w-auto mt-3 sm:mt-0'>
					<form onSubmit={handleSearchSubmit} className='flex'>
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
					<div className='ml-1 flex flex-row items-center sm:w-fit gap-2 justify-center pt-2 sm:pt-0 '>
						<Button
							onClick={handleCard}
							className='hover:bg-yellow-200 p-3 rounded-md'>
							<i className='pi pi-objects-column'></i>
						</Button>
						<Button
							onClick={handleList}
							className='hover:bg-yellow-200 p-3 rounded-md m-0'>
							<i className='pi pi-list'></i>
						</Button>
						<Button
							onClick={() => addModal.openModal()}
							className='btnprimary m-0'>
							<i className='pi pi-plus mr-2 font-bold'></i> Nuevo Cliente
						</Button>
					</div>
				</div>
			</div>
			{openCardClients && <CardClients users={filteredUsers} />}
			{openListClients && <TableClients users={filteredUsers} />}
			<Modals
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Nuevo Cliente'>
				<FormClients onClose={addModal.closeModal} mode='create' />
			</Modals>
		</div>
	);
};
