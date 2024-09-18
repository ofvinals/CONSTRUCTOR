/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormSelect, InputGroup, Table } from 'react-bootstrap';
import '../../../../styles/Custom.css';

export const MaterialItems = ({
	fields,
	remove,
	append,
	setTotalItems,
	control,
	setValue,
}) => {
	// Calcula el total de cada ítem
	useEffect(() => {
		const total = fields.reduce((sum, field) => {
			const itemTotalPrice = parseFloat(field.itemPrice) || 0;
			return sum + itemTotalPrice;
		}, 0);
		setTotalItems(total);
	}, [ ]);

	const handlePriceChange = (index, value) => {
		setValue(`items.${index}.itemPrice`, value);
		const updatedFields = [...fields];
		updatedFields[index].itemPrice = value;
		const total = updatedFields.reduce((sum, field) => {
			const itemTotalPrice = parseFloat(field.itemPrice) || 0;
			return sum + itemTotalPrice;
		}, 0);
		setTotalItems(total);
	};

	return (
		<div className='w-2/3 flex flex-row flex-wrap items-center justify-around h-full border-none'>
			<h2 className='text-xl font-bold h-[10%] mt-2'>
				Materiales y Maquinaria
			</h2>
			<div className='h-[350px] overflow-y-scroll mx-2'>
				<Table hover responsive>
					<thead className='border-none'>
						<tr className='border-b-2 border-slate-400'>
							<th className='bg-transparent border-none'>Tipo</th>
							<th className='bg-transparent border-none'>Descripcion</th>
							<th className='bg-transparent border-none'>
								Unidad de Medida
							</th>
							<th className='bg-transparent border-none'>Costo</th>
							<th className='bg-transparent border-none'>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{fields.map((field, index) => (
							<tr key={field.id}>
								<td
									className='bg-transparent border-none'
									style={{ verticalAlign: 'middle' }}>
									<Controller
										name={`items.${index}.type`}
										control={control}
										defaultValue={field.type || ''}
										render={({ field: { onChange, value } }) => (
											<FormSelect
												className='rounded-md p-2 w-[130px] border-1 border-black'
												onChange={(e) => onChange(e.target.value)}
												value={value}>
												<option value=''></option>
												<option value='Costes'>Costes</option>
												<option value='Material'>Materiales</option>
												<option value='Maquinaria'>
													Maquinarias
												</option>
												<option value='Adicional'>
													Adicionales
												</option>
											</FormSelect>
										)}
									/>
								</td>
								<td className='bg-transparent border-none'>
									<Controller
										name={`items.${index}.itemDescription`}
										control={control}
										defaultValue={field.itemDescription || ''}
										render={({ field: { onChange, value } }) => (
											<FormControl
												as='textarea'
												className='rounded-md p-2 min-w-[220px] border-1 border-black'
												onChange={(e) => onChange(e.target.value)}
												value={value}
											/>
										)}
									/>
								</td>
								<td
									className='bg-transparent border-none'
									style={{ verticalAlign: 'middle' }}>
									<Controller
										name={`items.${index}.itemUnit`}
										control={control}
										defaultValue={field.itemUnit || ''}
										render={({ field: { onChange, value } }) => (
											<FormSelect
												className='rounded-md p-2 w-[160px] border-1 border-black'
												onChange={(e) => onChange(e.target.value)}
												value={value}>
												<option value=''></option>
												<option value='Pa'>Pa</option>
												<option value='Mt'>Metro</option>
												<option value='Ml'>Metro Lineal</option>
												<option value='M2'>Metro Cuadrado</option>
												<option value='M3'>Metro Cubico</option>
												<option value='Un'>Unidad</option>
												<option value='Kg'>Kilogramos</option>
												<option value='Gl'>Global</option>
											</FormSelect>
										)}
									/>
								</td>
								<td
									className='bg-transparent border-none'
									style={{ verticalAlign: 'middle' }}>
									<InputGroup className='items-center w-[100px] rounded-md border-1 border-black'>
										<InputGroup.Text className='bg-white'>
											$
										</InputGroup.Text>
										<Controller
											name={`items.${index}.itemPrice`}
											control={control}
											defaultValue={field.itemPrice || ''}
											render={({ field: { onChange, value } }) => (
												<FormControl
													className='p-2 min-w-[80px] shadow-none border-none'
													type='number'
													onChange={(e) =>
														handlePriceChange(
															index,
															e.target.value
														)
													}
													value={value}
												/>
											)}
										/>
									</InputGroup>
								</td>
								<td
									className='bg-transparent border-none flex items-center justify-center h-[83px]'
									style={{ verticalAlign: 'middle' }}>
									<Button
										icon='pi pi-trash font-bold text-xl'
										className='text-red-500 hover:text-red-400'
										onClick={() => remove(index)}></Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
			<div className='h-[10%]'>
				<Button
					type='button'
					className='btnprimary'
					onClick={() =>
						append({
							type: '',
							itemDescription: '',
							itemUnit: '',
							itemCant: '',
							itemPrice: '',
						})
					}>
					<i className='pi pi-plus mr-2 font-bold'></i>
					Agregar Ítem
				</Button>
			</div>
		</div>
	);
};
