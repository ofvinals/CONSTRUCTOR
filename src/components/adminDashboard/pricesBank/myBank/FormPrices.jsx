import { Button } from 'primereact/button';
import { Form, FormControl, FormSelect, Table } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';

export const FormPrices = () => {
	const {
		register,
		handleSubmit,
		control,
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
					itemtotalPrice: '',
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});
	const onSubmit = handleSubmit(async ({ values }) => {
		try {
			console.log(values);
			// await loginEmail({ email, password });
		} catch (error) {
			console.error(error);
		}
	});
	return (
		<div>
			<Form
				id='ItemForm'
				className='flex flex-col justify-center items-center bg-background rounded-xl py-4'
				onSubmit={onSubmit}>
				<div className='flex flex-row justify-center items-center w-full'>
					<div className='w-1/3 flex flex-col items-center justify-around'>
						<Form.Group className='flex flex-col w-full items-start justify-around px-2'>
							<Form.Label className=' bg-transparent  text-neutral-800 font-medium '>
								Descripcion Corta
							</Form.Label>
							<FormControl
								style={{ outline: 'none', boxShadow: 'none' }}
								className=' rounded-md p-2 focus:outline-none border-2 border-black'
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
							<Form.Label className='bg-transparent  text-neutral-800  font-medium'>
								Descripcion Larga
							</Form.Label>
							<FormControl
								as='textarea'
								name='largeDescription'
								className=' text-black p-2 rounded-md focus:outline-none border-2 border-black'
								{...register('largeDescription')}
							/>
						</Form.Group>
					</div>

					<div className='w-2/3 flex flex-row flex-wrap items-center justify-around border-none'>
						<Table striped bordered hover responsive>
							<thead className='border-none'>
								<tr className='border-none'>
									<th className='bg-transparent border-none'>Tipo</th>
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
									<th className='bg-transparent border-none'>Total</th>
									<th className='bg-transparent border-none'>
										Acciones
									</th>
								</tr>
							</thead>
							<tbody>
								{fields.map((field, index) => (
									<tr key={field.id}>
										<td>
											<FormSelect
												className='rounded-md p-2 w-fit'
												type='text'
												{...register(`items.${index}.type`, {
													required:
														'El tipo de item es obligatorio',
												})}
												defaultValue={field.type}>
												<option value=''></option>
												<option value='Costes'>Costes</option>
												<option value='Material'>Material</option>
												<option value='Mano de obra'>
													Mano de obra
												</option>
												<option value='Maquinaria'>
													Maquinaria
												</option>
												<option value='Adicional'>Adicional</option>
											</FormSelect>
											{errors.items?.[index]?.type && (
												<span className='error-message'>
													{errors.items[index].type.message}
												</span>
											)}
										</td>
										<td>
											<FormControl
												as='textarea'
												className='rounded-md p-2 min-w-[220px]'
												{...register(
													`items.${index}.itemDescription`
												)}
												defaultValue={field.itemDescription}
											/>
										</td>
										<td>
											<FormSelect
												className='rounded-md p-2 w-fit'
												type='text'
												{...register(`items.${index}.itemUnit`)}
												defaultValue={field.itemUnit}>
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
										</td>
										<td>
											<FormControl
												className='rounded-md p-2 min-w-[70px]'
												type='number'
												{...register(`items.${index}.itemCant`)}
												defaultValue={field.itemCant}
											/>
										</td>
										<td>
											<FormControl
												className='rounded-md p-2 min-w-[80px]'
												type='number'
												{...register(`items.${index}.itemPrice`)}
												defaultValue={field.itemPrice}
											/>
										</td>
										<td>
											<FormControl
												className='rounded-md p-2 min-w-[80px]'
												type='number'
												{...register(
													`items.${index}.itemtotalPrice`
												)}
												defaultValue={field.itemtotalPrice}
												readOnly
											/>
										</td>
										<td className='flex items-center justify-center'>
											<Button
												icon='pi pi-trash font-bold text-xl'
												className=' text-red-500 m-auto'
												onClick={() => remove(index)}></Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Button
							className='btnprimary mt-3'
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
				<div className='w-full'>
          
        </div>
			</Form>
		</div>
	);
};
