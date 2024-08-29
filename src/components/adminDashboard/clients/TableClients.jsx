/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useUserActions } from '../../../hooks/UseUserActions';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Visibility as VisibilityIcon,
	PersonOff as PersonOffIcon,
	Person as PersonIcon,
} from '@mui/icons-material';
import useModal from '../../../hooks/useModal';
import Loader from '../../../utils/Loader';
import { Table } from '../../../utils/Table';
import Modals from '../../../utils/Modals';
import { FormClients } from './FormClients';
import { useAuth } from '../../../hooks/useAuth';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const TableClients = ({ users }) => {
	const {
		deleteUser,
		allUserStatus,
		userStatusDelete,
		enableUser,
		disableUser,
	} = useUserActions();
	const { loggedUser } = useAuth();
	const superAdmin = loggedUser.superAdmin;
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

	const handleConfirmDisable = async (uid) => {
		try {
			await disableUser({ id: uid });
		} catch (error) {
			console.error('Error al deshabilitar usuario:', error);
		}
	};

	const handleConfirmEnable = async (uid) => {
		try {
			await enableUser({ id: uid });
		} catch (error) {
			console.error('Error al habilitar usuario:', error);
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
			icon:
				admin || coadmin ? (
					<EditIcon color='success' cursor='pointer' />
				) : null,
			onClick: () => {
				if (!row.original.admin) {
					setRowId(row.original.uid);
					editModal.openModal();
				}
			},
		},
		{
			text: 'Eliminar',
			icon: superAdmin ? (
				<DeleteIcon color='error' cursor='pointer' />
			) : null,
			onClick: () => {
				if (!row.original.admin) {
					setRowId(row.original.uid);
					setShowConfirmDialog(true);
				}
			},
		},
		{
			text: row.original.isActive ? 'Suspender' : 'Habilitar',
			icon: row.original.isActive ? (
				<PersonOffIcon color='error' cursor='pointer' />
			) : (
				<PersonIcon color='success' cursor='pointer' />
			),
			onClick: () => {
				if (row.original.isActive) {
					handleConfirmDisable(row.original.uid);
				} else {
					handleConfirmEnable(row.original.uid);
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
