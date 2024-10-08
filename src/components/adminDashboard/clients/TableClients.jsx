/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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
import ConfirmDialog from '../../../utils/ConfirmDialog';
import { useUserActions } from '../../../hooks/useUserActions';

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
					<ConfirmDialog
						header='Confirmar Eliminacion'
						visible={showConfirmDialog}
						onHide={() => setShowConfirmDialog(false)}
						onConfirm={handleDeleteUser}
						message='¿Estás seguro de que quieres eliminar el cliente?'
					/>
				</div>
			</section>
		</>
	);
};
