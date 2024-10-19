import { useState } from 'react';
import { Card } from 'primereact/card';
import Loader from '../../../utils/Loader';
import Avatar from 'react-avatar';
import PaginatorComponent from '../../../utils/Paginator';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Custom.css';
import { useProyectActions } from '../../../hooks/useProyectActions';
import { MenuCard } from './MenuCard';
import { useBudgetActions } from '../../../hooks/useBudgetActions';

export const CardProyects = () => {
	const { allProyectsStatus, proyects } = useProyectActions();
	const { budgets } = useBudgetActions();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const navigate = useNavigate();

	const onPageChange = (event) => {
		setFirst(event.first);
		setRows(event.rows);
	};

	if (allProyectsStatus === 'Cargando') {
		return <Loader />;
	}

	const proyectsFiltered = budgets.filter(
		(budget) => budget.isProyect === true
	);

	const paginatedProyects =
		proyectsFiltered && proyectsFiltered.length > 0
			? proyectsFiltered.slice(first, first + rows)
			: null;

	return (
		<div className='pt-4 flex flex-col items-center bg-background'>
			<div className='flex flex-row flex-wrap items-center justify-around'>
				{paginatedProyects ? (
					paginatedProyects.map((budget) => (
						<Card
							key={budget.uid}
							className='w-[300px] h-full flex flex-col border-2 border-[#ffd52b] justify-center rounded-xl m-2'>
							<div className='flex flex-row w-full items-center justify-between'>
								<div
									className='flex flex-row items-center justify-between cursor-pointer'
									onClick={() => {
										localStorage.setItem('budgetId', budget.uid);
										navigate(`/proyects/budget/${budget.uid}`);
									}}>
									{budget.photoProfile ? (
										<img
											src={budget.photoProfile}
											alt='foto de proyecto'
											className='rounded-full m-2 h-[60px]'
										/>
									) : (
										<Avatar
											name={budget.proyectName}
											size='60'
											round={true}
											className='m-2'
										/>
									)}
									<h1 className='text-xl w-1/2 font-semibold m-2'>
										{budget.proyectName}
									</h1>
								</div>
								<div className=''>
									<MenuCard
										isActive={budget.isActive}
										budgetId={budget.uid}
									/>
								</div>
							</div>
							<div className='flex flex-col flex-grow items-center justify-center ml-3 '>
								<p>
									<i className='pi pi-people mr-1 font-bold'></i>
									<span>{budget.client?.displayName}</span>
								</p>
							</div>
						</Card>
					))
				) : (
					<div className='text-xl font-semibold'>
						No tienes proyectos pendientes
					</div>
				)}
			</div>
			<PaginatorComponent
				first={first}
				rows={rows}
				totalRecords={proyects?.length}
				onPageChange={onPageChange}
			/>
		</div>
	);
};
