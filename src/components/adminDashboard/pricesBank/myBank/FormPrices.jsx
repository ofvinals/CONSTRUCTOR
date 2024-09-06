/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';
import { useEffect } from 'react';
import {
	Form,
	FormControl,
	FormSelect,
	InputGroup,
	Table,
} from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { usePriceActions } from '../../../../hooks/usePriceActions';

export const FormPrices = ({
	id,
	onClose,
	mode,
	subcategoryId,
	categoryId,
	type,
}) => {
	const {
		getItemPrice,
		itemPrice,
		updateItemPrice,
		createCategoryItemPrice,
		createSubcategoryItemPrice,
	} = usePriceActions();
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			items: [
				{
					shortDescription: '',
					largeDescription: '',
					type: '',
					itemDescription: '',
					itemUnit: '',
					itemCant: '',
					itemPrice: '',
					itemTotalPrice: '',
				},
			],
		},
	});
	useEffect(() => {
		if ((mode === 'edit' || mode === 'view') && id && type) {
			getItemPrice({ categoryId, subcategoryId, itemId: id, type });
		}
	}, [id, type, mode, categoryId]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	useEffect(() => {
		if (itemPrice && (mode === 'edit' || mode === 'view')) {
			setValue('shortDescription', itemPrice?.shortDescription);
			setValue('largeDescription', itemPrice?.largeDescription);
			setValue('unitType', itemPrice?.unitType);
			setValue('unitPrice', itemPrice?.unitPrice);
			setValue('itemDescription', itemPrice.items?.itemDescription);
			setValue('itemUnit', itemPrice.items?.itemUnit);
			setValue('itemCant', itemPrice.items?.itemCant);
			setValue('itemPrice', itemPrice.items?.itemPrice);
			setValue('itemtotalPrice', itemPrice.items?.itemtotalPrice);
			setValue('FinalPrice', itemPrice?.FinalPrice);
		}
	}, [itemPrice]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			console.log(values);
			if (mode === 'edit') {
				await updateItemPrice({
					categoryId,
					subcategoryId,
					itemId: id,
					type,
					values,
				});
				onClose();
			} else if (type === 'category' && mode === 'create') {
				await createCategoryItemPrice({ categoryId, values });
				onClose();
			} else if (type === 'subcategory' && mode === 'create') {
				await createSubcategoryItemPrice({
					categoryId,
					subcategoryId,
					values,
				});
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	});

	// if (itemPriceStatus === 'Cargando' || itemPriceStatusUpdate === 'Cargando') {
	// 	return <Loader />;
	// }

	return (
		<div>
			<Form
				id='ItemForm'
				className='flex flex-col justify-center items-center  rounded-xl  '
				onSubmit={onSubmit}>
				<div className='w-full flex items-end justify-end  rounded-md'>
					<button onClick={onSubmit} className='btnprimary my-3 mr-4'>
						<i className='pi pi-save mr-2 font-bold'></i>
						Guardar Registro
					</button>
				</div>
				<div className='flex flex-row justify-center items-center w-full border-b-2 my-2  border-b-slate-400'>
					<div className='w-1/3 flex flex-col items-center justify-around border-r-2 h-[500px] border-r-slate-400 min-h-full '>
						<h2 className='text-xl font-bold mb-2'>Mano de Obra</h2>
						<Form.Group className='flex flex-col w-full items-start justify-around px-2'>
							<Form.Label className=' bg-transparent  text-neutral-800 font-bold '>
								Descripcion Corta
							</Form.Label>
							<FormControl
								className=' rounded-md p-2  border-1 border-black'
								type='text'
								name='shortDescription'
								{...register('shortDescription', {
									required: {
										value: true,
										message: 'La descripcion es obligatoria',
									},
								})}
							/>
							{errors.shortDescription && (
								<span className='error-message'>
									{errors.shortDescription.message}
								</span>
							)}
						</Form.Group>

						<Form.Group className='flex flex-col w-full items-start justify-around mt-3 px-2'>
							<Form.Label className='bg-transparent  text-neutral-800  font-bold'>
								Descripcion Larga
							</Form.Label>
							<FormControl
								as='textarea'
								name='largeDescription'
								className=' text-black p-2 rounded-md focus:outline-none border-1 border-black'
								{...register('largeDescription')}
							/>
						</Form.Group>
						<div className='flex flex-row flex-wrap items-center justify-center mb-3'>
							<Form.Group className='flex flex-col w-full items-start justify-around mt-3 px-2'>
								<Form.Label className=' bg-transparent  text-neutral-800 font-bold '>
									Precio Unitario
								</Form.Label>
								<InputGroup
									className={`items-center w-[150px] text-black ${
										mode === 'view'
											? 'border-1 border-black bg-transparent'
											: 'border-1 border-black rounded-md bg-white'
									}`}>
									<InputGroup.Text>$</InputGroup.Text>
									<FormControl
										className=' rounded-md p-2  '
										type='number'
										name='unitPrice'
										{...register('unitPrice', {
											required: {
												value: true,
												message:
													'El precio unitario es obligatorio',
											},
										})}
									/>
								</InputGroup>

								{errors.unitPrice && (
									<span className='error-message'>
										{errors.unitPrice.message}
									</span>
								)}
							</Form.Group>
							<Form.Group className='flex flex-col w-full items-start justify-around mt-3 px-2'>
								<Form.Label className=' bg-transparent  text-neutral-800 font-bold '>
									Unidad de Medida
								</Form.Label>
								<FormSelect
									className='rounded-md p-2 w-fit  border-1 border-black'
									type='text'
									{...register(`unitType`, {
										required: 'La unidad de medida es obligatoria',
									})}
									name='unitType'>
									<option value=''></option>
									<option value='Pa'>Costes</option>
									<option value='Mt'>Metro</option>
									<option value='Ml'>Metro Lineal</option>
									<option value='M2'>Metro Cuadrado</option>
									<option value='M3'>Metro Cubico</option>
									<option value='Un'>Unidad</option>
									<option value='Kg'>Kilogramos</option>
									<option value='Gl'>Global</option>
								</FormSelect>
								{errors.unitType && (
									<span className='error-message'>
										{errors.unitType.message}
									</span>
								)}
							</Form.Group>
						</div>
					</div>

					<div className='w-2/3 flex flex-row flex-wrap items-center justify-around h-[500px] border-none'>
						<h2 className='text-xl font-bold h-[10%] mt-2'>
							Materiales y Maquinaria
						</h2>
						<div className='h-[350px] overflow-y-scroll mx-2'>
							<Table hover responsive>
								<thead className='border-none'>
									<tr className='border-b-2 border-slate-400'>
										<th className='bg-transparent border-none'>
											Tipo
										</th>
										<th className='bg-transparent border-none'>
											Descripcion
										</th>
										<th className='bg-transparent border-none'>
											Unidad
										</th>
										<th className='bg-transparent border-none'>
											Cantidad
										</th>
										<th className='bg-transparent border-none'>
											Precio
										</th>
										<th className='bg-transparent border-none'>
											Total
										</th>
										<th className='bg-transparent border-none'>
											Acciones
										</th>
									</tr>
								</thead>
								<tbody>
									{fields.map((field, index) => (
										<tr key={field.id}>
											<td className='bg-transparent border-none'>
												<FormSelect
													className='rounded-md p-2 w-fit  border-1 border-black'
													type='text'
													{...register(`items.${index}.type`)}
													defaultValue={field.type}>
													<option value=''></option>
													<option value='Costes'>Costes</option>
													<option value='Material'>
														Materiales
													</option>
													<option value='Maquinaria'>
														Maquinarias
													</option>
													<option value='Adicional'>
														Adicionales
													</option>
												</FormSelect>
											</td>
											<td className='bg-transparent border-none'>
												<FormControl
													as='textarea'
													className='rounded-md p-2 min-w-[220px]  border-1 border-black'
													{...register(
														`items.${index}.itemDescription`
													)}
													defaultValue={field.itemDescription}
												/>
											</td>
											<td className='bg-transparent border-none'>
												<FormSelect
													className='rounded-md p-2 w-fit  border-1 border-black'
													type='text'
													{...register(`items.${index}.itemUnit`)}
													defaultValue={field.itemUnit}>
													<option value=''></option>
													<option value='Pa'>Costes</option>
													<option value='Mt'>Metro</option>
													<option value='Ml'>Metro Lineal</option>
													<option value='M2'>
														Metro Cuadrado
													</option>
													<option value='M3'>Metro Cubico</option>
													<option value='Un'>Unidad</option>
													<option value='Kg'>Kilogramos</option>
													<option value='Gl'>Global</option>
												</FormSelect>
											</td>
											<td className='bg-transparent border-none'>
												<FormControl
													className='rounded-md p-2 min-w-[70px]  border-1 border-black'
													type='number'
													{...register(`items.${index}.itemCant`)}
													defaultValue={field.itemCant}
												/>
											</td>
											<td className='bg-transparent border-none'>
												<FormControl
													className='rounded-md p-2 min-w-[80px]  border-1 border-black'
													type='number'
													{...register(`items.${index}.itemPrice`)}
													defaultValue={field.itemPrice}
												/>
											</td>
											<td className='bg-transparent border-none'>
												<FormControl
													className='rounded-md p-2 min-w-[80px]  border-1 border-black'
													type='number'
													{...register(
														`items.${index}.itemTotalPrice`
													)}
													defaultValue={field.itemTotalPrice}
													readOnly
												/>
											</td>
											<td className='bg-transparent border-none flex items-center justify-center h-full'>
											<Button
													icon='pi pi-trash font-bold text-xl'
													className=' text-red-500 '
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
								className='btnprimary  '
								onClick={() =>
									append({
										type: '',
										itemDescription: '',
										itemUnit: '',
										itemCant: '',
										itemPrice: '',
										itemtotalPrice: '',
									})
								}>
								<i className='pi pi-plus mr-2 font-bold '></i>
								Agregar Ítem
							</Button>
						</div>
					</div>
				</div>
				<div className='w-full flex flex-row items-center justify-around my-3'>
					<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
						<p className='font-bold text-center h-[50%] text-xl'>
							Costo Mano de Obra
						</p>
						<span className='mt-3 font-semibold text-xl'>$ </span>
					</div>
					<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
						<p className='font-bold text-center h-[50%] text-xl'>
							Costo Materiales y Maquinaria
						</p>{' '}
						<span className='mt-3 font-semibold text-xl'>$ </span>
					</div>
					<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
						<p className='font-bold text-center h-[50%] text-xl'>
							Costo Total
						</p>{' '}
						<span className='mt-3 font-semibold text-xl'>$ </span>
					</div>
				</div>
			</Form>
		</div>
	);
};
