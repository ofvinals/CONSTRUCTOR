/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useToolActions } from '../../../../hooks/useToolActions';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useModal from '../../../../hooks/useModal';
import Loader from '../../../../utils/Loader';
import { Table } from '../../../../utils/Table';
import Modals from '../../../../utils/Modals';
import { FormTools } from './FormTools';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { DateTime } from 'luxon';

export const TableTools = ({ tools }) => {
	const { deleteTool, allToolStatus, toolStatusDelete } = useToolActions();
	const [rowId, setRowId] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

	const handleDeleteTool = () => {
		if (rowId) {
			deleteTool({ id: rowId });
			setShowConfirmDialog(false);
		}
	};

	const columns = React.useMemo(
		() => [
			{
				header: 'Nombre',
				accessorKey: 'name',
			},
			{
				header: 'Modelo',
				accessorKey: 'model',
			},
			{
				header: 'Fecha Compra',
				accessorKey: 'purchaseDate',
				size: 10,
				Cell: ({ cell }) => {
					const purchaseDate = cell.getValue() || [];
					return <p>{formatDate(purchaseDate)}</p>;
				},
			},
			{
				header: 'Ubicacion',
				accessorKey: 'location',
				size: 10,
			},
		],
		[]
	);

	const actions = (row) => [
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
			icon: <DeleteIcon color='error' cursor='pointer' />,
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
					{allToolStatus === 'Cargando' ||
					toolStatusDelete === 'Cargando' ? (
						<Loader />
					) : (
						<div className='table-responsive'>
							<Table columns={columns} data={tools} actions={actions} />
						</div>
					)}
				</div>

				<div>
					<Modals
						isOpen={editModal.isOpen}
						onClose={editModal.closeModal}
						title='Editar Datos de Herramientas'>
						<FormTools
							id={rowId}
							onClose={editModal.closeModal}
							mode='edit'
						/>
					</Modals>
					<ConfirmDialog
						header='Confirmar Eliminacion'
						visible={showConfirmDialog}
						onHide={() => setShowConfirmDialog(false)}
						onConfirm={handleDeleteTool}
						message='¿Estás seguro de que quieres eliminar la herramienta?'
					/>
				</div>
			</section>
		</>
	);
};
