import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { CardBudgets } from '../../components/adminDashboard/budgets/CardBudgets';
import Modals from '../../utils/Modals';
import { FormBudgets } from '../../components/adminDashboard/budgets/FormBudgets';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { useBudgetActions } from '../../hooks/useBudgetActions';
import Loader from '../../utils/Loader';

export const Budgets = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredBudgets, setFilteredBudgets] = useState([]);
	const { budgets, budgetStatusDelete, budgetStatusUpdate } =
		useBudgetActions();
	const addModal = useModal();
	const navigate = useNavigate();
	console.log(budgets);
	useEffect(() => {
		const budgetsFiltered = budgets.filter(
			(budget) => budget.isProyect === false && budget.isActive === true
		);
		if (searchQuery) {
			const filtered = budgetsFiltered.filter(
				(budget) =>
					budget.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					budget.client?.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredBudgets(filtered);
		} else {
			setFilteredBudgets(budgetsFiltered);
		}
	}, [searchQuery, budgets]);
console.log(filteredBudgets)
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		navigate(`/budgets?search=${searchQuery}`);
	};
	if (budgetStatusDelete === 'Cargando' || budgetStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between my-3 mx-2'>
				<h1 className='title'>Presupuestos</h1>
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
							<i className='pi pi-plus mr-2 font-bold'></i> Nuevo
							Presupuesto
						</Button>
					</div>
				</div>
			</div>
			<CardBudgets budgets={filteredBudgets} />
			<Modals
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Nuevo Presupuesto'>
				<FormBudgets onClose={addModal.closeModal} mode='create' />
			</Modals>
		</div>
	);
};
