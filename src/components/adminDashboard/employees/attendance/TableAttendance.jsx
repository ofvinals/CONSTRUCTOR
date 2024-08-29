/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { useAttendanceActions } from '../../../../hooks/UseAttendanceActions';
import {
	Edit as EditIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import useModal from '../../../../hooks/useModal';
import Loader from '../../../../utils/Loader';
import Modals from '../../../../utils/Modals';
import { FormAttendance } from './FormAttendance';
import { useAuth } from '../../../../hooks/useAuth';
import TreeTable from '../../../../utils/TreeTable'; 
import { TextField } from '@mui/material';

export const TableAttendance = () => {
	const { attendances, allAttendanceStatus, attendanceStatusDelete } =
		useAttendanceActions();
	const { loggedUser } = useAuth();
	const admin = loggedUser?.admin;
	const coadmin = loggedUser?.coadmin;
	const [rowId, setRowId] = useState(null);
	const [expandedRow, setExpandedRow] = useState(null);
	const viewModal = useModal();
	const editModal = useModal();

	const handleCellEdit = (rowId, key, value) => {
		// Implement the logic to handle cell editing
		console.log(`Edited row ${rowId}, key ${key}, value ${value}`);
	};

	const columns = [
		{ accessorKey: 'date', header: 'Fecha', size:10 },

		{
			accessorKey: 'displayName',
			header: 'Empleado',
			Cell: ({ row }) => <div>{row.original.displayName}</div>,
		},
		{
			accessorKey: 'position',
			header: 'Posición',
      size:10,
		},
		{
			accessorKey: 'construction',
			header: 'Obra',
      size:10,
		},
		{
			accessorKey: 'startTime',
			header: 'Hora Ingreso',
      size:10,
			Cell: ({ row }) => (
				<>
					{console.log(row)}
					{expandedRow === row.original.uid ? (
						<TextField
							value={row.original.startTime || ''}
							onChange={(e) =>
								handleCellEdit(
									row.original.uid,
									'startTime',
									e.target.value
								)
							}
							size='small'
							fullWidth
						/>
					) : (
						row.original.startTime
					)}
					,
				</>
			),
		},
		{
			accessorKey: 'endTime',
			header: 'Hora Salida',
      size:10,
			Cell: ({ row }) => (
				<div>
					{expandedRow === row.original.uid ? (
						<TextField
							value={row.original.endTime || ''}
							onChange={(e) =>
								handleCellEdit(
									row.original.uid,
									'endTime',
									e.target.value
								)
							}
							size='small'
							fullWidth
						/>
					) : (
						row.original.endTime
					)}
				</div>
			),
		},
	];

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
	];

	const handleRowExpand = (rowId) => {
		setExpandedRow(expandedRow === rowId ? null : rowId);
	};

	return (
		<>
			<section className='bg-background pb-3 '>
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
								actions={actions}
								onRowExpand={handleRowExpand}
								expandedRow={expandedRow}
							/>
						</div>
					)}
				</div>

				<div>
					<Modals
						isOpen={editModal.isOpen}
						onClose={editModal.closeModal}
						title='Editar Datos de la Asistencia'>
						<FormAttendance
							id={rowId}
							onClose={editModal.closeModal}
							mode='edit'
						/>
					</Modals>
					<Modals
						isOpen={viewModal.isOpen}
						onClose={viewModal.closeModal}
						title='Ver Datos de la Asistencia'>
						<FormAttendance
							id={rowId}
							onClose={viewModal.closeModal}
							mode='view'
						/>
					</Modals>
				</div>
			</section>
		</>
	);
};
