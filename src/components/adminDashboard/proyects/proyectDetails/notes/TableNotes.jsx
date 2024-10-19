/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useProyectActions } from '../../../../../hooks/useProyectActions';
import { useAuth } from '../../../../../hooks/useAuth';
import useModal from '../../../../../hooks/useModal';
import Loader from '../../../../../utils/Loader';
import { Table } from '../../../../../utils/Table';
import Modals from '../../../../../utils/Modals';
import ConfirmDialog from '../../../../../utils/ConfirmDialog';
import { FormNotes } from './FormNotes';

export const TableNotes = ({ notes, proyectId }) => {
	const { deleteNote, allNoteStatus, noteStatusDelete } = useProyectActions();
	const { loggedUser } = useAuth();
	const superAdmin = loggedUser.superAdmin;
	const [rowId, setRowId] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const viewModal = useModal();
	const editModal = useModal();

	const handleDeleteNote = () => {
		if (rowId) {
			deleteNote({ id: rowId });
			setShowConfirmDialog(false);
		}
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Fecha',
				accessorKey: 'date',
			},
			{
				header: 'Tematica',
				accessorKey: 'noteTitle',
			},
			{
				header: 'Asuntos',
				accessorKey: 'noteThemes',
				size: 50,
				Cell: ({ row }) => {
					const count = row.original.noteThemes.length;
					return `${count} asunto${count !== 1 ? 's' : ''} tratados`;
				},
			},
			{
				header: 'Estado',
				accessorKey: 'active',
				size: 50,
				Cell: ({ row }) => {
					return row.original.isActive ? 'Habilitado' : 'Suspendido';
				},
			},
		],
		[]
	);

	const actions = (row) => [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' cursor='pointer' />,
			onClick: () => {
				setRowId(row.original.uid);
				viewModal.openModal();
			},
		},
		{
			text: 'Editar',
			icon: <EditIcon color='success' cursor='pointer' />,
			onClick: () => {
				setRowId(row.original.uid);
				editModal.openModal();
			},
		},
		{
			text: 'Eliminar',
			icon: superAdmin ? (
				<DeleteIcon color='error' cursor='pointer' />
			) : null,
			onClick: () => {
				setRowId(row.original.uid);
				setShowConfirmDialog(true);
			},
		},
	];
	
	return (
		<>
			<section className='bg-background pb-3 '>
				<hr className='linea text-white mx-3' />
				<div className='container-lg my-3'>
					{allNoteStatus === 'Cargando' ||
					noteStatusDelete === 'Cargando' ? (
						<Loader />
					) : (
						<div className='table-responsive'>
							<Table columns={columns} data={notes} actions={actions} />
						</div>
					)}
				</div>

				<div>
					<Modals
						isOpen={editModal.isOpen}
						onClose={editModal.closeModal}
						title='Editar Datos del Acta'>
						<FormNotes
							proyectId={proyectId}
							noteId={rowId}
							onClose={editModal.closeModal}
							mode='edit'
						/>
					</Modals>
					<Modals
						isOpen={viewModal.isOpen}
						onClose={viewModal.closeModal}
						title='Ver Datos del Acta'>
						<FormNotes
							proyectId={proyectId}
							noteId={rowId}
							onClose={viewModal.closeModal}
							mode='view'
						/>
					</Modals>
					<ConfirmDialog
						header='Confirmar Eliminacion'
						visible={showConfirmDialog}
						onHide={() => setShowConfirmDialog(false)}
						onConfirm={handleDeleteNote}
						message='¿Estás seguro que quieres eliminar el acta?'
					/>
				</div>
			</section>
		</>
	);
};
