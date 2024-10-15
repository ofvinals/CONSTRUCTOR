/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import useModal from '../../../../hooks/useModal';
import { useBudgetDetailsActions } from '../../../../hooks/useBudgetDetailsActions';
import { useBudgetActions } from '../../../../hooks/useBudgetActions';
import Modals from '../../../../utils/Modals';
import { FormPrices } from '../formDetailBudget/FormPrices';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import TableActions from './TableActions';
import { formatCurrency } from '../../../../utils/FormatCurrency';
import { Table } from 'react-bootstrap';

export const TableBudget = ({
	budgetId,
	category,
	categoryId,
	subcategory,
	subcategoryId,
	handleCheckboxChange,
	selectedItemsSubcategory,
	selectedItemsCategory,
}) => {
	const { updateItemPrice, deleteItemPrice } = useBudgetDetailsActions();
	const { configValues } = useBudgetActions();
	const editModal = useModal();
	const [editableItemId, setEditableItemId] = useState(null);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [measurementValue, setMeasurementValue] = useState('');
	const items = category?.items || subcategory?.items || [];
	const benefits = configValues.benefits;

	const handleMeasurementInputChange = useCallback((e) => {
		setMeasurementValue(e.target.value);
	}, []);
	
	const handleItemCheckboxChange = (itemId, isChecked) => {
		handleCheckboxChange({
			categoryId,
			subcategoryId: subcategory?.uid || null,
			itemId,
			isChecked,
		});
	};
	// Función para manejar la eliminación de un item
	const handleDeleteItem = () => {
		if (itemIdToDelete) {
			deleteItemPrice({
				budgetId,
				categoryId,
				subcategoryId: subcategory?.uid || null,
				itemId: itemIdToDelete,
			});
			setShowConfirmDialog(false);
		}
	};

	const handleInputClick = useCallback((itemUid, currentMeasurement) => {
		setEditableItemId(itemUid);
		setMeasurementValue(currentMeasurement || '');
	}, []);

	const calculateTotalCost = useCallback((finalPrice, measurement) => {
		const measurementValue = parseFloat(measurement) || 0;
		return finalPrice * measurementValue;
	}, []);

	const calculateAdjustedPrice = useCallback((totalCost, percentage) => {
		const increment = (totalCost * percentage) / 100;
		return totalCost + increment;
	}, []);

	const handleMeasurementChange = useCallback(
		(itemUid, newMeasurement) => {
			updateItemPrice({
				budgetId,
				subcategoryId,
				categoryId,
				itemId: itemUid,
				values: { measurement: newMeasurement },
			});
			setEditableItemId(null);
		},
		[budgetId, subcategoryId, updateItemPrice]
	);

	return (
		<div className='w-full'>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th rowSpan='2' className='text-center align-middle'>
							#
						</th>
						<th rowSpan='2' className='text-center align-middle'>
							Descripción
						</th>
						<th rowSpan='2' className='text-center align-middle'>
							Medición
						</th>
						<th rowSpan='2' className='text-center max-w-[90px]'>
							Unidad de Medida
						</th>
						<th rowSpan='2' className='text-center max-w-[90px]'>
							Margen de beneficio
						</th>
						<th colSpan='2' className='text-center'>
							Costo Real
						</th>
						<th colSpan='2' className='text-center'>
							Costo Cliente
						</th>
						<th rowSpan='2' className='text-center align-middle'>
							Acciones
						</th>
					</tr>
					<tr>
						<th className='text-center'>Unidad</th>
						<th className='text-center'>Total</th>
						<th className='text-center'>Unidad</th>
						<th className='text-center'>Total</th>
					</tr>
				</thead>
				<tbody>
					{items?.map((item, index) => {
						const finalPrice = parseFloat(item.finalPrice) || 0;
						const adjustedPrice = calculateAdjustedPrice(
							finalPrice,
							benefits
						);
						const totalCost = calculateTotalCost(
							finalPrice,
							item.measurement
						);
						const adjustedCost = calculateAdjustedPrice(
							totalCost,
							benefits
						);
						const isChecked =
							(category &&
								selectedItemsCategory?.[categoryId]?.includes(
									item?.uid
								)) ||
							(subcategory &&
								selectedItemsSubcategory?.[subcategory?.uid]?.includes(
									item?.uid
								)) ||
							false;

						return (
							<tr key={index}>
								<td className='align-middle text-center'>
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
										className='rounded-md size-4'
									/>
								</td>
								<td className='text-nowrap align-middle'>
									{item.shortDescription}
								</td>
								<td className='text-center text-nowrap align-middle'>
									{editableItemId === item.uid ? (
										<input
											type='text'
											value={measurementValue}
											onChange={handleMeasurementInputChange}
											onClick={(e) => e.stopPropagation()}
											onBlur={() =>
												handleMeasurementChange(
													item.uid,
													measurementValue
												)
											}
											onFocus={() =>
												handleInputClick(item.uid, item.measurement)
											}
											className='form-control w-[130px]'
										/>
									) : (
										<span
											className='w-[50px]'
											onClick={() =>
												handleInputClick(item.uid, item.measurement)
											}>
											{item.measurement || 'No especificado'}
										</span>
									)}
								</td>
								<td className='text-center text-nowrap align-middle max-w-[90px]'>
									{item.unitType}
								</td>
								<td className='text-center text-nowrap align-middle max-w-[90px]'>
									{benefits} %
								</td>
								<td className='text-center text-nowrap align-middle'>
									{formatCurrency(finalPrice)}
								</td>
								<td className='text-center text-nowrap align-middle'>
									{formatCurrency(totalCost)}
								</td>
								<td className='text-center text-nowrap align-middle'>
									{isNaN(adjustedPrice)
										? '$ 0'
										: formatCurrency(adjustedPrice)}
								</td>
								<td className='text-center text-nowrap align-middle'>
									{isNaN(adjustedCost)
										? '$ 0'
										: formatCurrency(adjustedCost)}
								</td>
								<td>
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
							</tr>
						);
					})}
				</tbody>
			</Table>
			<Modals
				fullscreen={true}
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Item'>
				<FormPrices
					budgetId={budgetId}
					id={itemIdToEdit}
					onClose={editModal.closeModal}
					categoryId={categoryId}
					subcategoryId={subcategory?.uid}
					mode='edit'
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
