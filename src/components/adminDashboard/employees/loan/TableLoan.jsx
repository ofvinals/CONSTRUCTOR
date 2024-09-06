/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import { useLoanActions } from '../../../../hooks/useLoanActions';
import Loader from '../../../../utils/Loader';
import { Table } from '../../../../utils/Table';
import { DateTime } from 'luxon';
import {
	Edit as EditIcon,
	Visibility as VisibilityIcon,
	Delete as DeleteIcon,
	Paid as PaidIcon,
} from '@mui/icons-material';
import Modals from '../../../../utils/Modals';
import { FormLoan } from './FormLoan';
import useModal from '../../../../hooks/useModal';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { useAuth } from '../../../../hooks/useAuth';

export const TableLoan = () => {
	const {
		loans,
		updateLoan,
		deleteLoan,
		allLoanStatus,
		loanStatusDelete,
		payLoan,
	} = useLoanActions();
	const { loggedUser } = useAuth();
	const superAdmin = loggedUser.superAdmin;
	const [validationErrors, setValidationErrors] = useState({});
	const [rowId, setRowId] = useState(null);
	const viewModal = useModal();
	const editModal = useModal();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [showConfirmPayDialog, setShowConfirmPayDialog] = useState(false);
	const formatDate = (date) => {
		const parsedDate = DateTime.fromISO(date, {
			zone: 'America/Argentina/Buenos_Aires',
		});
		if (parsedDate.isValid) {
			return parsedDate.toFormat('dd/MM/yyyy');
		}
		return '';
	};
	const filteredLoans = loans.filter((loan) => loan.isPay === false);
	const formatCurrency = (value) => {
		const numberValue = parseFloat(value);
		if (!isNaN(numberValue)) {
			return new Intl.NumberFormat('es-AR', {
				style: 'currency',
				currency: 'ARS',
				minimumFractionDigits: 0,
			}).format(numberValue);
		}
		return value;
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
	const handleDeleteLoan = () => {
		if (rowId) {
			deleteLoan({ id: rowId });
			setShowConfirmDialog(false);
		}
	};
	const handlePayLoan = () => {
		if (rowId) {
			payLoan({ id: rowId });
			setShowConfirmPayDialog(false);
		}
	};
	const columns = useMemo(
		() => [
			{
				accessorKey: 'date',
				header: 'Fecha',
				enableEditing: false,
				enableSorting: true,
				size: 10,
				Cell: ({ cell }) => formatDate(cell.getValue()),
			},
			{
				accessorKey: 'employee',
				header: 'Empleado',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'typeLoan',
				header: 'Tipo',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'valueLoan',
				header: 'Monto',
				size: 10,
				Cell: ({ cell }) => formatCurrency(cell.getValue()),
			},
			{
				accessorKey: 'quoteLoan',
				header: 'Cuotas',
				size: 10,
			},
			{
				accessorKey: 'dueDates',
				header: 'Vencimientos',
				size: 10,
				Cell: ({ cell }) => {
					const dueDates = cell.getValue() || [];
					return (
						<ul>
							{dueDates.map((date, index) => (
								<li key={index}>{formatDate(date)}</li>
							))}
						</ul>
					);
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
			text: 'Marcar Pagado',
			icon: <PaidIcon color='black' cursor='pointer' />,
			onClick: () => {
				setRowId(row.original.uid);
				setShowConfirmPayDialog(true);
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
		<section className='bg-background pb-3'>
			<hr className='linea text-white mx-3' />
			<div className='container-lg my-3'>
				{allLoanStatus === 'Cargando' || loanStatusDelete === 'Cargando' ? (
					<Loader />
				) : (
					<div className='table-responsive'>
						<Table
							columns={columns}
							data={filteredLoans}
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
				title='Editar Datos del Adelanto/Prestamo'>
				<FormLoan id={rowId} onClose={editModal.closeModal} mode='edit' />
			</Modals>
			<Modals
				isOpen={viewModal.isOpen}
				onClose={viewModal.closeModal}
				title='Ver Datos del Adelanto/Prestamo'>
				<FormLoan id={rowId} onClose={viewModal.closeModal} mode='view' />
			</Modals>
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={handleDeleteLoan}
				message='¿Estás seguro de que quieres eliminar el adelanto?'
			/>
			<ConfirmDialog
				header='Confirmar Pago'
				visible={showConfirmPayDialog}
				onHide={() => setShowConfirmPayDialog(false)}
				onConfirm={handlePayLoan}
				message='¿Estás seguro de que quieres confirmar el pago?'
			/>
		</section>
	);
};
