/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react';
import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';
import Loader from '../../../../utils/Loader';
import TreeTable from '../../../../utils/TreeTable';
import { DateTime } from 'luxon';

export const TableAttendance = () => {
	const {
		attendances,
		updateAttendance,
		allAttendanceStatus,
		attendanceStatusDelete,
	} = useAttendanceActions();
	const [validationErrors, setValidationErrors] = useState({});

	const formatDate = (date) => {
		const parsedDate = DateTime.fromISO(date, {
			zone: 'America/Argentina/Buenos_Aires',
		});
		if (parsedDate.isValid) {
			return parsedDate.toFormat('dd/MM/yyyy');
		}
		return '';
	};

	const selectOptions = [
		{
			value: 'Remedios de Escalada',
			label: 'Remedios de Escalada',
		},
		{
			value: 'Las Moras',
			label: 'Las Moras',
		},
		{
			value: 'Estados Unidos',
			label: 'Estados Unidos',
		},
	];
	const handleUpdateAttendance = async ({ values, row, table }) => {
		try {
			let parentRow = row.getParentRow();
			// Si la fila principal no es encontrada, recorrer los padres hasta encontrarla
			while (parentRow && parentRow.getParentRow()) {
				parentRow = parentRow.getParentRow();
			}
			const id = parentRow.original.uid;
			const cleanValues = { ...values };
			delete cleanValues.date;
			cleanValues.employeeId = row.original.uid;
			cleanValues.attendance = cleanValues.startTime ? true : false;
			await updateAttendance({
				id,
				values: cleanValues,
			});
			table.setEditingRow(null);
		} catch (error) {
			console.error('Error al guardar el usuario:', error);
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
				Cell: ({ cell }) => {
					const dateValue = cell.getValue();
					return formatDate(dateValue);
				},
			},
			{
				accessorKey: 'displayName',
				header: 'Empleado',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'position',
				header: 'Posicion',
				enableEditing: false,
				size: 10,
			},
			{
				accessorKey: 'construction',
				size: 10,
				header: 'Obra',
				editVariant: 'select',
				editSelectOptions: selectOptions,
				muiEditTextFieldProps: {
					required: true,
					select: true,
					error: !!validationErrors?.construction,
					helperText: validationErrors?.construction,
				},
			},
			{
				accessorKey: 'startTime',
				size: 10,
				header: 'Hora Ingreso',
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.startDate,
					helperText: validationErrors?.startDate,
				},
			},
			{
				accessorKey: 'endTime',
				size: 10,
				header: 'Hora Salida',
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.endDate,
					helperText: validationErrors?.endDate,
				},
			},
		],
		[validationErrors]
	);

	return (
		<section className='bg-background pb-3'>
			<hr className='linea text-white mx-3' />
			<div className='container-lg my-3'>
				{allAttendanceStatus === 'Cargando' ||
				attendanceStatusDelete === 'Cargando' ? (
					<Loader />
				) : (
					<div className='table-responsive'>
						<TreeTable
							columns={columns}
							data={attendances || []}
							validationErrors={validationErrors}
							setValidationErrors={setValidationErrors}
							onSave={handleUpdateAttendance}
							initialSortColumn='date'
						/>
					</div>
				)}
			</div>
		</section>
	);
};
