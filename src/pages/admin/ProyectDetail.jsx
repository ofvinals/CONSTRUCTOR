/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProyectActions } from '../../hooks/useProyectActions';
import { AccordionBudget } from '../../components/adminDashboard/budgets/AccordionBudget';
import { MenuConfig } from '../../components/adminDashboard/budgets/accordionDetails/config/MenuConfig';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmDialog from '../../utils/ConfirmDialog';
import { ResumeBudget } from '../../components/adminDashboard/budgets/accordionDetails/ResumeBudget';
import { useBudgetActions } from '../../hooks/useBudgetActions';

export const ProyectDetail = () => {
	const { budgetId } = useParams();
	const { getProyect, proyects, disableProyect } = useProyectActions();
	const { getBudget, budget } = useBudgetActions();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmHeader, setConfirmHeader] = useState('');
	const [proyectId, setProyectId] = useState(null);

	useEffect(() => {
		if (budgetId === undefined) {
			const storedBudgetId = localStorage.getItem('budgetId');
			getBudget({ storedBudgetId });
		} else {
			getBudget({ budgetId });
			if (proyects && proyectId) {
				const foundProyect = proyects.find(
					(proyect) => proyect.budgetId === budgetId
				);
				if (foundProyect) {
					setProyectId(foundProyect.budgetId);
					getProyect({ proyectId });
				}
			}
		}
	}, [proyects, proyectId]);

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

	const handleArchiveProyect = () => {
		handleShowConfirmDialog(
			() => disableProyect({ proyectId }),
			'Confirmar Archivado',
			'¿Estás seguro que quieres archivar el proyecto?'
		);
	};

	const handleEndProyect = () => {
		handleShowConfirmDialog(
			() => disableProyect({ proyectId }),
			'Confirmar Finalizacion',
			'¿Estás seguro que quieres finalizar el proyecto?'
		);
	};

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between mt-3 mx-1'>
				<h1 className='items-start text-start title'>
					Proyecto {budget?.proyectName}
				</h1>
				<div className='flex flex-row flex-wrap items-end justify-around gap-2'>
					<div className='card flex justify-content-center'>
						<Dropdown>
							<Dropdown.Toggle
								className='btnprimary px-2 focus:bg-[#e5e7eb] focus:text-black'
								id='dropdown-basic'>
								<i className='pi pi-server mr-2'></i>
								Cerrar Proyecto
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item
									onClick={handleArchiveProyect}
									className='text-lg hover:font-bold hover:bg-[#fde047]'>
									<i className='pi pi-bookmark mr-2'></i>
									Archivar Proyecto
								</Dropdown.Item>
								<Dropdown.Item
									onClick={handleEndProyect}
									className='text-lg hover:font-bold hover:bg-[#fde047]'>
									<i className='pi pi-bookmark mr-2'></i>
									Finalizar Proyecto
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<MenuConfig proyectId={proyectId} />
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
