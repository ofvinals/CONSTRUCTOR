import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { TableTools } from '../../components/adminDashboard/tools/stock/TableTools';
import Modals from '../../utils/Modals';
import { FormTools } from '../../components/adminDashboard/tools/stock/FormTools';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { useToolActions } from '../../hooks/useToolActions';
import Loader from '../../utils/Loader';

export const Tools = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredTools, setFilteredTools] = useState([]);
	const { tools, toolStatusDelete, toolStatusUpdate } = useToolActions();
	const addModal = useModal();
	const navigate = useNavigate();

	useEffect(() => {
		if (searchQuery) {
			const filtered = tools.filter(
				(tool) =>
					tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					tool.client?.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredTools(filtered);
		} else {
			setFilteredTools(tools);
		}
	}, [searchQuery, tools]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/tools?search=${searchQuery}`);
	};
	if (toolStatusDelete === 'Cargando' || toolStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between my-3 mx-2'>
				<h1 className='title'>Herramientas</h1>
				<div className='flex flex-wrap items-center justify-center md:justify-end w-full sm:w-auto mt-3 sm:mt-0'>
					<form onSubmit={handleSearchSubmit} className='flex'>
						<input
							type='text'
							placeholder='Buscar...'
							className='w-full px-2 py-1 bg-white border-1 border-yellow-500 text-black rounded-md '
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							type='submit'
							className='ml-2 bg-[#ffd52b] hover:bg-[#fde047] duration-200 text-black px-3 py-2 rounded-md focus:outline-none'>
							<i className='pi pi-search font-bold'></i>
						</button>
					</form>
					<div className='ml-1 flex flex-row items-center sm:w-fit gap-2 justify-center sm:justify-around pt-0 '>
						<Button
							onClick={() => addModal.openModal()}
							className='btnprimary m-0'>
							<i className='pi pi-plus mr-2 font-bold'></i> Nueva
							Herramienta
						</Button>
					</div>
				</div>
			</div>
			<TableTools tools={filteredTools} />
			<Modals
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Nueva Herramienta'>
				<FormTools onClose={addModal.closeModal} mode='create' />
			</Modals>
		</div>
	);
};
