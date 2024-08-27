/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FormInput, SaveButton, CancelButton } from '../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import { useUserActions } from '../../../hooks/UseUserActions.js';
import Loader from '../../../utils/Loader.jsx';

export const FormClients = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const {
		user,
		userStatus,
		createUser,
		getUser,
		updateUser,
		userStatusUpdate,
	} = useUserActions();
	console.log(user);
	console.log(userStatus);

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getUser({ id });
		}
	}, [id]);

	useEffect(() => {
		if (user && (mode === 'edit' || mode === 'view')) {
			setValue('nombre', user.nombre);
			setValue('apellido', user.apellido);
			setValue('email', user.email);
			setValue('domicilio', user.domicilio);
			setValue('dni', user.dni);
			setValue('cel', user.cel)
		}
	}, [user]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			const { nombre, apellido } = values;
			const displayName = `${nombre} ${apellido}`;
			const updatedValues = { ...values, displayName };
			if (mode === 'edit') {
				await updateUser({ id, values: updatedValues });
				onClose();
			} else if (mode === 'create') {
				await createUser({ values: updatedValues });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar el usuario:', error);
		}
	});
	console.log(userStatus);
	if (userStatus === 'Cargando' || userStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<FormInput
					label='Nombre'
					name='nombre'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El nombre o razon social es obligatorio.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='Apellido'
					name='apellido'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='DNI/CUIT'
					name='dni'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						minLength: {
							value: 8,
							message:
								'El DNI/CUIT debe contenter entre 8 y 11 digitos.',
						},
						maxLength: {
							value: 11,
							message:
								'El DNI/CUIT debe contenter entre 8 y 11 digitos.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='Email'
					name='email'
					type='email'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El email es obligatorio.',
						},
						pattern: {
							value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
							message: 'El email no es válido',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='Domicilio'
					name='domicilio'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El domicilio es obligatorio.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormInput
					label='Celular'
					name='cel'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El celular es obligatorio.',
						},
						minLength: {
							value: 10,
							message: 'El celular debe contenter 10 digitos.',
						},
						maxLength: {
							value: 10,
							message: 'El celular debe contenter 10 digitos.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				{mode !== 'view' && mode !== 'edit' && (
					<FormInput
						label='Contraseña'
						name='password'
						type='password'
						register={register}
						errors={errors}
						mode={mode}
						options={{
							required: {
								value: true,
								message: 'La contraseña es obligatoria.',
							},
							minLength: {
								value: 7,
								message:
									'La contraseña debe tener al menos 7 caracteres',
							},
						}}
						disabled={mode === 'view' && mode === 'edit'}
					/>
				)}

				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Cliente'
									: 'Guardar Cambios'
							}
						/>
					)}
					<CancelButton
						onClose={onClose}
						label={mode === 'view' ? 'Volver' : 'Cancelar'}
					/>
				</Form.Group>
			</Form>
		</div>
	);
};
