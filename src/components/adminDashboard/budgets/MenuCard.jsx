/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useBudgetActions } from '../../../hooks/useBudgetActions';
import Modals from '../../../utils/Modals';
import { FormBudgets } from './FormBudgets';
import ConfirmDialog from '../../../utils/ConfirmDialog';
import useModal from '../../../hooks/useModal';

export const MenuCard = ({ isActive, budgetId }) => {
	const {
		deleteBudget,
		getBudget,
		duplicateBudget,
		disableBudget,
		enableBudget,
		budget,
	} = useBudgetActions();
	const menuRef = useRef(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmHeader, setConfirmHeader] = useState('');
	const editModal = useModal();

	const handleShowConfirmDialog = (action, header, message) => {
		setConfirmAction(() => action);
		setConfirmHeader(header);
		setConfirmMessage(message);
		setShowConfirmDialog(true);
	};

	const handleConfirm = async () => {
		await confirmAction();
		setShowConfirmDialog(false);
	};

	const handleDeleteBudget = () => {
		handleShowConfirmDialog(
			() => deleteBudget({ budgetId }),
			'Confirmar Eliminación',
			'¿Estás seguro que quieres eliminar el presupuesto?'
		);
	};

	const handleDuplicateBudget = async () => {
		try {
			await getBudget({ budgetId });
			if (budget) {
				await duplicateBudget({ budgetId });
			}
		} catch (error) {
			console.error('Error al duplicar el presupuesto:', error);
		}
	};

	const handleArchiveBudget = () => {
		handleShowConfirmDialog(
			() => disableBudget({ budgetId }),
			'Confirmar Archivado',
			'¿Estás seguro que quieres archivar el presupuesto?'
		);
	};

	const handleUnarchiveBudget = () => {
		handleShowConfirmDialog(
			() => enableBudget({ budgetId }),
			'Confirmar Desarchivado',
			'¿Estás seguro que quieres desarchivar el presupuesto?'
		);
	};

	const items = [
		{
			label: 'Editar',
			icon: 'pi pi-pencil text-green-500',
			command: () => {
				editModal.openModal();
			},
		},
		{
			label: 'Duplicar',
			icon: 'pi pi-replay text-blue-500',
			command: () => handleDuplicateBudget(),
		},
		{
			label: 'Eliminar',
			icon: 'pi pi-times text-red-500',
			command: () => handleDeleteBudget(budget),
		},
		{
			label: isActive ? 'Archivar' : 'Desarchivar',
			icon: isActive
				? 'pi pi-arrow-down text-orange-500'
				: 'pi pi-arrow-up text-green-500',
			command: isActive ? handleArchiveBudget : handleUnarchiveBudget,
		},
	];

	return (
		<>
			<div>
				<Button
					className='shadow-none'
					icon='pi pi-ellipsis-v'
					onClick={(e) => {
						e.stopPropagation(), menuRef.current.toggle(e);
					}}
				/>
				<Menu model={items} popup ref={menuRef} />
			</div>
			<Modals
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Datos del Presupuesto'>
				<FormBudgets
					budgetId={budgetId}
					onClose={editModal.closeModal}
					mode='edit'
				/>
			</Modals>
			<ConfirmDialog
				header={confirmHeader}
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={handleConfirm}
				message={confirmMessage}
			/>
		</>
	);
};
