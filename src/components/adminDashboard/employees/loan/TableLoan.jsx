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
} from '@mui/icons-material';
import Modals from '../../../../utils/Modals';
import { FormLoan } from './FormLoan';
import useModal from '../../../../hooks/useModal';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export const TableLoan = () => {
	const { loans, updateLoan, deleteLoan, allLoanStatus, loanStatusDelete } =
		useLoanActions();
	const [validationErrors, setValidationErrors] = useState({});
	const [rowId, setRowId] = useState(null);
	const viewModal = useModal();
	const editModal = useModal();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const formatDate = (date) => {
		const parsedDate = DateTime.fromISO(date, {
			zone: 'America/Argentina/Buenos_Aires',
		});
		if (parsedDate.isValid) {
			return parsedDate.toFormat('dd/MM/yyyy');
		}
		return '';
	};

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
				if (!row.original.admin) {
					setRowId(row.original.uid);
					editModal.openModal();
				}
			},
		},
		{
			text: 'Eliminar',
			icon: <DeleteIcon color='error' cursor='pointer' />,
			onClick: () => {
				if (!row.original.admin) {
					setRowId(row.original.uid);
					setShowConfirmDialog(true);
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
				onClick={handleDeleteLoan}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);

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
							data={loans}
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
			<Dialog
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar el adelanto/prestamo?</p>
			</Dialog>
		</section>
	);
};
