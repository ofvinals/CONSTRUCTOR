/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useEmployeeActions } from '../../../hooks/useEmployeeActions';
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
import { FormEmployees } from './FormEmployees';
import { useAuth } from '../../../hooks/useAuth';
import ConfirmDialog from '../../../utils/ConfirmDialog';

export const TableEmployees = ({ employees }) => {
	const {
		deleteEmployee,
		allEmployeeStatus,
		employeeStatusDelete,
		enableEmployee,
		disableEmployee,
	} = useEmployeeActions();
	const { loggedUser } = useAuth();
	const superAdmin = loggedUser.superAdmin;
	const [rowId, setRowId] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const viewModal = useModal();
	const editModal = useModal();

	const handleDeleteEmployee = () => {
		if (rowId) {
			deleteEmployee({ id: rowId });
			setShowConfirmDialog(false);
		}
	};

	const handleConfirmDisable = async (uid) => {
		try {
			await disableEmployee({ id: uid });
		} catch (error) {
			console.error('Error al deshabilitar el empleado:', error);
		}
	};

	const handleConfirmEnable = async (uid) => {
		try {
			await enableEmployee({ id: uid });
		} catch (error) {
			console.error('Error al habilitar el empleado:', error);
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
				accessorKey: 'cel',
				size: 50,
			},
			{
				header: 'Position',
				accessorKey: 'position',
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
					{allEmployeeStatus === 'Cargando' ||
					employeeStatusDelete === 'Cargando' ? (
						<Loader />
					) : (
						<div className='table-responsive'>
							<Table
								columns={columns}
								data={employees}
								actions={actions}
							/>
						</div>
					)}
				</div>

				<div>
					<Modals
						isOpen={editModal.isOpen}
						onClose={editModal.closeModal}
						title='Editar Datos del Empleado'>
						<FormEmployees
							id={rowId}
							onClose={editModal.closeModal}
							mode='edit'
						/>
					</Modals>
					<Modals
						isOpen={viewModal.isOpen}
						onClose={viewModal.closeModal}
						title='Ver Datos del Empleado'>
						<FormEmployees
							id={rowId}
							onClose={viewModal.closeModal}
							mode='view'
						/>
					</Modals>
					<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={handleDeleteEmployee}
				message='¿Estás seguro de que quieres eliminar el empleado?'
			/>
				</div>
			</section>
		</>
	);
};
