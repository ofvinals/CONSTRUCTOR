/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import {
	FormInput,
	FormSelect,
	SaveButton,
	CancelButton,
} from '../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import { useEmployeeActions } from '../../../hooks/useEmployeeActions';
import Loader from '../../../utils/Loader.jsx';
import { getEmployees } from '../../../store/employees/thunks.js';

export const FormEmployees = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const {
		employee,
		employeeStatus,
		createEmployee,
		getEmployee,
		updateEmployee,
		employeeStatusUpdate,
	} = useEmployeeActions();

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getEmployee({ id });
		}
	}, [id]);

	useEffect(() => {
		if (employee && (mode === 'edit' || mode === 'view')) {
			setValue('nombre', employee.nombre);
			setValue('apellido', employee.apellido);
			setValue('position', employee.position);
			setValue('domicilio', employee.domicilio);
			setValue('dni', employee.dni);
			setValue('cel', employee.cel);
		}
	}, [employee]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			const { nombre, apellido } = values;
			const displayName = `${nombre} ${apellido}`;
			const updatedValues = { ...values, displayName };
			if (mode === 'edit') {
				await updateEmployee({ id, values: updatedValues });
				onClose();
			} else if (mode === 'create') {
				await createEmployee({ values: updatedValues });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar el empleado:', error);
		}
	});

	if (employeeStatus === 'Cargando' || employeeStatusUpdate === 'Cargando') {
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
							message: 'El nombre es obligatorio.',
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
					options={{
						required: {
							value: true,
							message: 'El apellido es obligatorio.',
						},
					}}
				/>

				<FormInput
					label='DNI'
					name='dni'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						minLength: {
							value: 8,
							message: 'El DNI debe contenter entre 8 y 11 digitos.',
						},
						maxLength: {
							value: 11,
							message: 'El DNI debe contenter entre 8 y 11 digitos.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				<FormSelect
					label='Posicion'
					name='position'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'La posicion es obligatoria.',
						},
					}}
					readOnly={mode === 'view'}
					selectOptions={[
						{ value: 'Capataz', label: 'Capataz' },
						{ value: 'Sanitarista', label: 'Sanitarista' },
						{ value: 'Oficial', label: 'Oficial' },
						{ value: 'Electricista', label: 'Electricista' },
					]}
				/>

				<FormInput
					label='Domicilio'
					name='domicilio'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
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

				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Empleado'
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
