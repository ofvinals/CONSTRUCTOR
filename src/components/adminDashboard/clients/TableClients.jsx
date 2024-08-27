/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useUserActions } from '../../../hooks/UseUserActions';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import useModal from '../../../hooks/useModal';
import Loader from '../../../utils/Loader';
import { Table } from '../../../utils/Table';
import Modals from '../../../utils/Modals';
import { FormClients } from './FormClients';
import { useAuth } from '../../../hooks/useAuth';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const TableClients = ({users}) => {
	const {  allUserStatus, deleteUser, userStatusDelete } =
		useUserActions();
	const { loggedUser } = useAuth();
	const admin = loggedUser.admin;
	const coadmin = loggedUser.coadmin;
	const [rowId, setRowId] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const viewModal = useModal();
	const editModal = useModal();

	const handleDeleteUser = () => {
		if (rowId) {
			deleteUser({ id: rowId });
			setShowConfirmDialog(false);
		}
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Nombre',
				accessorKey: 'nombre',
			},
			{
				header: 'Apellido',
				accessorKey: 'apellido',
			},
			{
				header: 'Celular',
				accessorKey: 'celular',
				size: 50,
			},
			{
				header: 'Email',
				accessorKey: 'email',
				size: 50,
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

	const actions = [
		{
			text: 'Ver',
			icon: <VisibilityIcon color='primary' cursor='pointer' />,
			onClick: (row) => {
				setRowId(row.original.uid);
				viewModal.openModal();
			},
		},
		{
			text: 'Editar',
			icon:
				admin || coadmin ? (
					<EditIcon color='success' cursor='pointer' />
				) : null,
			onClick: (row) => {
				if (!row.original.admin) {
					setRowId(row.original.uid);
					editModal.openModal();
				} else {
					null;
				}
			},
		},
		{
			text: 'Eliminar',
			icon: admin ? <DeleteIcon color='error' cursor='pointer' /> : null,
			onClick: (row) => {
				if (!row.original.admin) {
					setRowId(row.original.uid);
					setShowConfirmDialog(true);
				} else {
					null;
				}
			},
		},
	];

	const footerContent = (
		<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2'
				onClick={() => setShowConfirmDialog(false)}
				className='p-button-text hover:bg-red-100 p-2 rounded-md'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2'
				onClick={handleDeleteUser}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);

	return (
		<>
			<section className='bg-background pb-3 '>
				<hr className='linea text-white mx-3' />
				<div className='container-lg my-3'>
					{allUserStatus === 'Cargando' ||
					userStatusDelete === 'Cargando' ? (
						<Loader />
					) : (
						<div className='table-responsive'>
							<Table columns={columns} data={users} actions={actions} />
						</div>
					)}
				</div>

				<div>
					<Modals
						isOpen={editModal.isOpen}
						onClose={editModal.closeModal}
						title='Editar Datos del Cliente'>
						<FormClients
							id={rowId}
							onClose={editModal.closeModal}
							mode='edit'
						/>
					</Modals>
					<Modals
						isOpen={viewModal.isOpen}
						onClose={viewModal.closeModal}
						title='Ver Datos del Cliente'>
						<FormClients
							id={rowId}
							onClose={viewModal.closeModal}
							mode='view'
						/>
					</Modals>
					<Dialog
						visible={showConfirmDialog}
						onHide={() => setShowConfirmDialog(false)}
						header='Confirmar Eliminación'
						footer={footerContent}>
						<p>¿Estás seguro de que quieres eliminar este usuario?</p>
					</Dialog>
				</div>
			</section>
		</>
	);
};
