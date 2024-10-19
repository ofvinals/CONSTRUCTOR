/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useProyectActions } from '../../../hooks/useProyectActions';
import ConfirmDialog from '../../../utils/ConfirmDialog';
import useModal from '../../../hooks/useModal';

export const MenuCard = ({ isActive, budgetId }) => {
	const {
		proyects,
		getProyect,
		deleteProyect,
		disableProyect,
		enableProyect,
		proyect,
	} = useProyectActions();
	const menuRef = useRef(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const [confirmMessage, setConfirmMessage] = useState('');
	const [confirmHeader, setConfirmHeader] = useState('');
	const editModal = useModal();
	const [proyectId, setProyectId] = useState(null);
	console.log(proyects);
	useEffect(() => {
		if (proyects && budgetId) {
			const foundProyect = proyects.find(
				(proyect) => proyect.budgetId === budgetId
			);
			console.log(foundProyect)
			if (foundProyect) {
				const fetchProyect = async () => {
					setProyectId(foundProyect.uid);
					await getProyect({ proyectId: foundProyect.uid });
				};
				fetchProyect();
			}
		}
	}, [proyects]);

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

	const handleDeleteProyect = () => {
		handleShowConfirmDialog(
			() => deleteProyect({ proyectId }),
			'Confirmar Eliminación',
			'¿Estás seguro que quieres eliminar el proyecto?'
		);
	};

	const handleArchiveProyect = () => {
		handleShowConfirmDialog(
			() => disableProyect({ proyectId }),
			'Confirmar Archivado',
			'¿Estás seguro que quieres archivar el proyecto?'
		);
	};

	const handleUnarchiveProyect = () => {
		handleShowConfirmDialog(
			() => enableProyect({ proyectId }),
			'Confirmar Desarchivado',
			'¿Estás seguro que quieres desarchivar el proyecto?'
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
			label: 'Eliminar',
			icon: 'pi pi-times text-red-500',
			command: () => handleDeleteProyect(proyect),
		},
		{
			label: isActive ? 'Archivar' : 'Desarchivar',
			icon: isActive
				? 'pi pi-arrow-down text-orange-500'
				: 'pi pi-arrow-up text-green-500',
			command: isActive ? handleArchiveProyect : handleUnarchiveProyect,
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
