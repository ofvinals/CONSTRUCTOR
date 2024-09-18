/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap';
import TableActions from './TableActions';
import { formatCurrency } from '../../../../utils/FormatCurrency';
import { useBudgetActions } from '../../../../hooks/useBudgetActions';

const BudgetTable = ({
	items,
	editableItemId,
	measurementValue,
	onMeasurementInputChange,
	onMeasurementBlur,
	onItemCheckboxChange,
	onInputClick,
	onEditItem,
	onDeleteItem,
	calculateAdjustedPrice,
	calculateTotalCost,
}) => {
	const { configValues } = useBudgetActions();
	const benefits = parseFloat(configValues.benefits) || 0;
	return (
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
					const adjustedCost = calculateAdjustedPrice(totalCost, benefits);

					return (
						<tr key={index}>
							<td className='align-middle text-center'>
								<input
									type='checkbox'
									checked={item.isSelected }
									onClick={(e) => e.stopPropagation()}
									onChange={(e) =>
										onItemCheckboxChange(item.uid, e.target.checked)
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
										onChange={onMeasurementInputChange}
										onClick={(e) => e.stopPropagation}
										onBlur={() =>
											onMeasurementBlur(item.uid, measurementValue)
										}
										onFocus={() =>
											onInputClick(item.uid, item.measurement)
										}
										className='form-control'
									/>
								) : (
									<span
										className='w-[50px]'
										onClick={() =>
											onInputClick(item.uid, item.measurement)
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
								{formatCurrency(adjustedPrice)}
							</td>
							<td className='text-center text-nowrap align-middle'>
								{formatCurrency(adjustedCost)}
							</td>
							<td>
								<TableActions
									onEdit={(e) => {
										e.stopPropagation();
										onEditItem(item.uid);
									}}
									onDelete={(e) => {
										e.stopPropagation();
										onDeleteItem(item.uid);
									}}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default BudgetTable;
