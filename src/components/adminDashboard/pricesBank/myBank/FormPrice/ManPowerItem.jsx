/* eslint-disable react/prop-types */
import { Form, FormControl, FormSelect, InputGroup } from 'react-bootstrap';

export const ManPowerItem = ({ register, errors, setLaborPrice }) => (
	<div className='w-1/3 flex flex-col items-center justify-around border-r-2 h-full border-r-slate-400 min-h-full'>
		<h2 className='text-xl font-bold mb-2'>Mano de Obra</h2>
		<Form.Group className='flex flex-col w-full items-start justify-around px-2'>
			<Form.Label className='bg-transparent text-neutral-800 font-bold'>
				Descripcion Corta
			</Form.Label>
			<FormControl
				className='rounded-md p-2 border-1 border-black'
				type='text'
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
			<Form.Group className='flex flex-col items-start justify-around mt-3 px-2'>
				<Form.Label className=' bg-transparent  text-neutral-800 font-bold '>
					Costo Unitario
				</Form.Label>
				<InputGroup className='items-center w-[150px] text-black border-1 border-black rounded-md bg-white'>
					<InputGroup.Text className='bg-white'>$</InputGroup.Text>
					<FormControl
						className=' rounded-md p-2 border-none shadow-none  '
						type='number'
						name='laborPrice'
						{...register('laborPrice', {
							required: {
								value: true,
								message: 'El precio unitario es obligatorio',
							},
						})}
						onChange={(e) =>
							setLaborPrice(parseFloat(e.target.value) || 0)
						}
					/>
				</InputGroup>
				{errors.laborPrice && (
					<span className='error-message'>
						{errors.laborPrice.message}
					</span>
				)}
			</Form.Group>
			<Form.Group className='flex flex-col  items-start justify-around mt-3 px-2'>
				<Form.Label className=' bg-transparent  text-neutral-800 font-bold '>
					Unidad de Medida
				</Form.Label>
				<FormSelect
					className='rounded-md p-2 w-[170px]  border-1 border-black'
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
					<span className='error-message'>{errors.unitType.message}</span>
				)}
			</Form.Group>
		</div>
	</div>
);
