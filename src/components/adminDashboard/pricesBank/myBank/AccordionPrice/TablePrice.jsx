/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap';
import TableActions from './TableActions';
import useModal from '../../../../../hooks/useModal';
import ConfirmDialog from '../../../../../utils/ConfirmDialog';
import { FormPrices } from '../FormPrice/FormPrices';
import Modals from '../../../../../utils/Modals';
import { useState } from 'react';
import { usePriceActions } from '../../../../../hooks/usePriceActions';
import { formatCurrency } from '../../../../../utils/FormatCurrency';

export const TablePrice = ({
	selectedItemsSubcategory,
	selectedItemsCategory = { items: [] },
	handleCheckboxChange,
	categoryId,
	subcategory,
	subcategoryId,
	category,
	isBudget,
}) => {
	const editModal = useModal();
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const { deleteItemPrice } = usePriceActions();

	// Determinar la lista de items a mostrar
	const items = category?.items || subcategory?.items || [];

	// Función para manejar el cambio del checkbox
	const handleItemCheckboxChange = (itemId, isChecked) => {
		handleCheckboxChange({
			categoryId,
			subcategoryId: subcategoryId || null,
			itemId,
			isChecked,
		});
	};

	// Función para manejar la eliminación de un item
	const handleDeleteItem = () => {
		if (itemIdToDelete) {
			deleteItemPrice({
				categoryId,
				subcategoryId: subcategory?.uid || null,
				itemId: itemIdToDelete,
			});
			setShowConfirmDialog(false);
		}
	};

	return (
		<div className='w-full'>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th className='text-center w-[50px]'>#</th>
						<th>Descripción</th>
						<th className='text-center'>Unidad</th>
						<th className='text-center'>Precio</th>
						{isBudget ? null : (
							<th className='text-center w-[100px]'>Acciones</th>
						)}
					</tr>
				</thead>
				<tbody>
					{items.length > 0 ? (
						items.map((item, index) => {
							const isChecked =
								(Array.isArray(selectedItemsCategory.items) &&
									selectedItemsCategory.items.includes(item.uid)) ||
								(selectedItemsSubcategory?.[subcategoryId]?.items &&
									Array.isArray(
										selectedItemsSubcategory[subcategoryId].items
									) &&
									selectedItemsSubcategory[
										subcategory.uid
									].items.includes(item.uid)) ||
								false;

							return (
								<tr key={index}>
									<td style={{ verticalAlign: 'middle' }}>
										<input
											type='checkbox'
											checked={isChecked}
											onClick={(e) => e.stopPropagation()}
											onChange={(e) =>
												handleItemCheckboxChange(
													item.uid,
													e.target.checked
												)
											}
											className='ml-2 rounded-md size-4'
										/>
									</td>
									<td style={{ verticalAlign: 'middle' }}>
										{item.shortDescription}
									</td>
									<td
										className='text-center'
										style={{ verticalAlign: 'middle' }}>
										{item.unitType}
									</td>
									<td
										className='text-center'
										style={{ verticalAlign: 'middle' }}>
										{formatCurrency(item.finalPrice)}
									</td>
									{isBudget ? null : (
										<td className='flex w-[100px] items-center justify-around'>
											<TableActions
												onEdit={(e) => {
													e.stopPropagation();
													editModal.openModal();
													setItemIdToEdit(item.uid);
												}}
												onDelete={(e) => {
													e.stopPropagation();
													setShowConfirmDialog(true);
													setItemIdToDelete(item.uid);
												}}
											/>
										</td>
									)}
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan='5' className='text-center'>
								No hay datos disponibles
							</td>
						</tr>
					)}
				</tbody>
			</Table>
			<Modals
				fullscreen={true}
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Item de SubRubro'>
				<FormPrices
					id={itemIdToEdit}
					onClose={editModal.closeModal}
					subcategoryId={subcategory?.uid}
					categoryId={categoryId}
					mode='edit'
					type='subcategory'
				/>
			</Modals>
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={handleDeleteItem}
				message='¿Estás seguro de que quieres eliminar el item?'
			/>
		</div>
	);
};
