/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react';
import { useLoanActions } from '../../../../hooks/useLoanActions';
import Loader from '../../../../utils/Loader';
import { Table } from '../../../../utils/Table';
import { DateTime } from 'luxon';
import {
	Edit as EditIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import Modals from '../../../../utils/Modals';
import { FormLoan } from './FormLoan';
import useModal from '../../../../hooks/useModal';

export const TableLoan = () => {
	const { loans, updateLoan, allLoanStatus, loanStatusDelete } =
		useLoanActions();
	const [validationErrors, setValidationErrors] = useState({});
	const [rowId, setRowId] = useState(null);
	const viewModal = useModal();
	const editModal = useModal();
	const formatDate = (date) => {
		const parsedDate = DateTime.fromISO(date, {
			zone: 'America/Argentina/Buenos_Aires',
		});
		if (parsedDate.isValid) {
			return parsedDate.toFormat('dd/MM/yyyy');
		}
		return '';
	};

	const handleUpdateLoan = async ({ values, row, table }) => {
		try {
			const id = row.original.uid;

			await updateLoan({
				id,
				values,
			});
			table.setEditingRow(null);
		} catch (error) {
			console.error('Error al actualizar el prestamo:', error);
		}
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'values.date',
				header: 'Fecha',
				enableEditing: false,
				enableSorting: true,
				size: 10,
				Cell: ({ cell }) => {
					const dateValue = cell.getValue();
					return formatDate(dateValue);
				},
			},
			{
				accessorKey: 'values.employee',
				header: 'Empleado',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'values.typeLoan',
				header: 'Tipo',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'values.valueLoan',
				size: 10,
				header: 'Monto',
			},
			{
				accessorKey: 'values.quoteLoan',
				size: 10,
				header: 'Cuotas',
			},
			{
				accessorKey: 'values.quoteDateLoan',
				size: 10,
				header: 'Vencimiento',
				Cell: ({ cell }) => {
					const dateValue = cell.getValue();
					return formatDate(dateValue);
				},
			},
		],
		[validationErrors]
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
				if (!row.original.admin) {
					setRowId(row.original.uid);
					editModal.openModal();
				}
			},
		},
		// {
		// 	text: 'Eliminar',
		// 	icon: superAdmin ? (
		// 		<DeleteIcon color='error' cursor='pointer' />
		// 	) : null,
		// 	onClick: () => {
		// 		if (!row.original.admin) {
		// 			setRowId(row.original.uid);
		// 			setShowConfirmDialog(true);
		// 		}
		// 	},
		// },
	];

	return (
		<section className='bg-background pb-3'>
			<hr className='linea text-white mx-3' />
			<div className='container-lg my-3'>
				{allLoanStatus === 'Cargando' ||
				loanStatusDelete === 'Cargando' ||
				loans > 0 ? (
					<Loader />
				) : (
					<div className='table-responsive'>
						<Table
							columns={columns}
							data={loans || []}
							actions={actions}
							validationErrors={validationErrors}
							setValidationErrors={setValidationErrors}
							onSave={handleUpdateLoan}
							initialSortColumn='date'
						/>
					</div>
				)}
			</div>
			<Modals
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Datos del Prestamo'>
				<FormLoan id={rowId} onClose={editModal.closeModal} mode='edit' />
			</Modals>
			<Modals
				isOpen={viewModal.isOpen}
				onClose={viewModal.closeModal}
				title='Ver Datos del Prestamo'>
				<FormLoan id={rowId} onClose={viewModal.closeModal} mode='view' />
			</Modals>
		</section>
	);
};
