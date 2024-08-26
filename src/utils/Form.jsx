/* eslint-disable react/prop-types */
import { Button, Form } from 'react-bootstrap';

export const FormInput = ({
	label,
	name,
	type,
	register,
	errors,
	mode,
	options,
	customClass,
}) => {
	const isCaratula = name === 'caratula';
	const isExpte = name === 'nroexpte';
	const inputClass = `items-center w-full p-2 focus:outline-none text-black ${
		isCaratula || (isExpte && mode === 'view') || mode === 'view'
			? 'border-none shadow-none bg-transparent'
			: 'border-2 border-black shadow-2xl rounded-md'
	}`;

	return (
		<Form.Group
			className={`flex flex-col mb-3 items-center justify-around ${
				isCaratula || type === 'textarea' ? 'w-full' : 'w-5/12'
			} mt-2`}>
			<Form.Label
				className={`text-start bg-transparent text-xl mb-0 mt-2  ${
					customClass ? 'text-white' : 'text-background'
				}  w-full font-medium`}>
				{label}
			</Form.Label>
			{type === 'textarea' ? (
				<Form.Control
					as='textarea'
					className={inputClass}
					{...register(name, options)}
					rows={5}
					readOnly={
						isCaratula || (isExpte && mode === 'view') || mode === 'view'
					}
					disabled={
						isCaratula || (isExpte && mode === 'view') || mode === 'view'
					}
				/>
			) : (
				<Form.Control
					className={inputClass}
					type={type}
					{...register(name, options)}
					readOnly={
						isCaratula || (isExpte && mode === 'view') || mode === 'view'
					}
					disabled={
						isCaratula || (isExpte && mode === 'view') || mode === 'view'
					}
				/>
			)}
			{errors[name] && (
				<span className='error-message'>{errors[name].message}</span>
			)}
		</Form.Group>
	);
};

export const FormSelect = ({
	label,
	name,
	register,
	errors,
	mode,
	options,
	selectOptions,
	customClass,
}) => {
	const isCaratula = name === 'caratula';
	const selectClass = `items-center w-full p-2 focus:outline-none text-black ${
		isCaratula || mode === 'view'
			? 'border-none shadow-none bg-transparent'
			: 'border-2 border-black shadow-2xl rounded-md'
	}`;

	return (
		<Form.Group
			className={`flex flex-col mb-3 items-center justify-around ${
				isCaratula ? 'w-full' : 'w-5/12'
			} mt-2`}>
			<Form.Label
				className={`text-start bg-transparent text-xl mb-0 mt-2 ${
					customClass ? 'text-white' : 'text-background'
				}  w-full font-medium`}>
				{label}
			</Form.Label>
			<Form.Control
				as='select'
				className={selectClass}
				{...register(name, options)}
				readOnly={isCaratula || mode === 'view'}
				disabled={isCaratula || mode === 'view'}>
				<option value=''>Selecciona..</option>
				{selectOptions.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</Form.Control>
			{errors[name] && (
				<span className='error-message'>{errors[name].message}</span>
			)}
		</Form.Group>
	);
};

export const SaveButton = ({ onSubmit, label }) => (
	<Button
		type='submit'
		className='bg-background shadow-3xl btnLogout text-white text-center p-2 border-2 w-[230px] my-3  border-white rounded-xl font-semibold'
		onClick={onSubmit}>
		{label}
	</Button>
);

export const CancelButton = ({ onClose, label }) => (
	<Button
		className='bg-white shadow-3xl btnAdmin text-primary text-center p-2 border-2 w-[150px] my-3 border-primary rounded-xl font-semibold'
		onClick={onClose}>
		{label}
	</Button>
);
