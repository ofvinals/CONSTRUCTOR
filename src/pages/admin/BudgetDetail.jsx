/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBudgetActions } from '../../hooks/useBudgetActions';
import { AccordionBudget } from '../../components/adminDashboard/budgets/AccordionBudget';
import { MenuConfig } from '../../components/adminDashboard/budgets/accordionDetails/config/MenuConfig';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmDialog from '../../utils/ConfirmDialog';
import { ResumeBudget } from '../../components/adminDashboard/budgets/accordionDetails/ResumeBudget';
import BudgetGeneratePDF from '../../utils/BudgetGeneratePDF';

export const BudgetDetail = () => {
	const { budgetId } = useParams();
	const { getBudget, budget, disableBudget, getConfigValues } =
		useBudgetActions();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmHeader, setConfirmHeader] = useState('');

	useEffect(() => {
		getBudget({ budgetId });
		getConfigValues({ budgetId });
	}, [budgetId]);

	const handleShowConfirmDialog = (action, header, message) => {
		setConfirmAction(() => action);
		setConfirmHeader(header);
		setConfirmMessage(message);
		setShowConfirmDialog(true);
	};

	const handleConfirm = async () => {
		if (confirmAction) {
			await confirmAction();
		}
		setShowConfirmDialog(false);
	};

	const handleProyectBudget = () => {
		handleShowConfirmDialog(
			() => proyectBudget({ budgetId }),
			'Confirmar Inicio de Proyecto',
			'¿Estás seguro que quieres iniciar el proyecto?'
		);
	};

	const handleArchiveBudget = () => {
		handleShowConfirmDialog(
			() => disableBudget({ budgetId }),
			'Confirmar Archivado',
			'¿Estás seguro que quieres archivar el presupuesto?'
		);
	};

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between mt-3 mx-1'>
				<h1 className='items-start text-start title'>
					Presupuesto {budget?.proyectName}
				</h1>
				<div className='flex flex-row flex-wrap items-end justify-around gap-2'>
					<div className='card flex justify-content-center'>
						<Dropdown>
							<Dropdown.Toggle
								className='btnprimary px-2 focus:bg-[#e5e7eb] focus:text-black'
								id='dropdown-basic'>
								<i className='pi pi-server mr-2'></i>
								Cerrar Presupuesto
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item
									onClick={handleArchiveBudget}
									className='text-lg hover:font-bold hover:bg-[#fde047]'>
									<i className='pi pi-bookmark mr-2'></i>
									Archivar Presupuesto
								</Dropdown.Item>
								<Dropdown.Item
									onClick={handleProyectBudget}
									className='text-lg hover:font-bold hover:bg-[#fde047]'>
									<i className='pi pi-arrow-up-right mr-2 text-green-500'></i>
									Iniciar Proyecto
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<BudgetGeneratePDF />
					<MenuConfig budgetId={budgetId} />
				</div>
			</div>
			<div className='mt-3'>
				<AccordionBudget />
			</div>
			<div className='mx-2'>
				<ResumeBudget />
			</div>
			<ConfirmDialog
				header={confirmHeader}
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={handleConfirm}
				message={confirmMessage}
			/>
		</div>
	);
};
