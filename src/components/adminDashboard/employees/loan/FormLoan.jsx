/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import {
	FormInput,
	FormSelect,
	SaveButton,
	CancelButton,
} from '../../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import Loader from '../../../../utils/Loader.jsx';
import { useLoanActions } from '../../../../hooks/useLoanActions.js';
import { InputGroup } from 'react-bootstrap';

export const FormLoan = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
		watch,
	} = useForm();
	const { employees } = useEmployeeActions();
	const {
		loan,
		getLoan,
		updateLoan,
		createLoan,
		loanStatus,
		loanStatusUpdate,
	} = useLoanActions();
	const [dueDates, setDueDates] = useState([]);
	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getLoan({ id });
		}
	}, [id, mode]);
	const typeLoan = watch('typeLoan');
	const numQuotes = watch('quoteLoan');
	useEffect(() => {
		if (loan && (mode === 'edit' || mode === 'view')) {
			setValue('date', loan.date);
			setValue('employee', loan.employee);
			setValue('employeeId', loan.employeeId);
			setValue('typeLoan', loan.typeLoan);
			setValue('valueLoan', loan.valueLoan);
			setValue('quoteLoan', loan.quoteLoan);
			setValue('quoteDateLoan', loan.quoteDateLoan);
			setValue('dueDates', loan.dueDates);
		}
	}, [loan, mode, setValue]);
	useEffect(() => {
		if (numQuotes !== undefined) {
			setDueDates((prevDueDates) => {
				if (typeLoan === 'Adelanto') {
					return prevDueDates.length > 0 ? prevDueDates : [''];
				} else {
					if (numQuotes > prevDueDates.length) {
						return [
							...prevDueDates,
							...Array(numQuotes - prevDueDates.length).fill(''),
						];
					} else if (numQuotes < prevDueDates.length) {
						return prevDueDates.slice(0, numQuotes);
					}
					return prevDueDates;
				}
			});
		}
	}, [numQuotes, typeLoan]);
	const onSubmit = handleSubmit(async (values) => {
		try {
			console.log(values);
			// Procesar los vencimientos y almacenarlos en el array `dueDates`
			const updatedDueDates = dueDates.map(
				(_, index) => getValues(`dueDates[${index}]`) || ''
			);
			console.log(updatedDueDates);
			const updatedValues = {
				...values,
				dueDates: updatedDueDates,
			};
			console.log(updatedValues);
			if (mode === 'edit') {
				await updateLoan({ id, values: updatedValues });
				onClose();
			} else if (mode === 'create') {
				await createLoan({ values: updatedValues });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar el prestamo:', error);
		}
	});
	const handleDateChange = (index, date) => {
		console.log(date);
		const updatedDates = [...dueDates];
		updatedDates[index] = date;
		console.log(updatedDates);
		setDueDates(updatedDates);
	};
	if (loanStatus === 'Cargando' || loanStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<FormSelect
					label='Empleado'
					name='employee'
					register={register}
					errors={errors}
					mode={mode}
					selectOptions={employees.map((employee) => ({
						value: employee.displayName,
						label: employee.displayName,
					}))}
					options={{
						required: {
							value: true,
							message: 'El empleado es obligatorio.',
						},
					}}
					onChange={(e) => {
						const selectedEmployee = employees.find(
							(emp) => emp.displayName === e.target.value
						);
						if (selectedEmployee) {
							setValue('employee', selectedEmployee.displayName);
							setValue('employeeId', selectedEmployee.uid);
						}
					}}
					readOnly={mode === 'view'}
				/>
				<FormInput
					label='Fecha'
					name='date'
					type='date'
					register={register}
					errors={errors}
					mode={mode}
					readOnly={mode === 'view'}
					options={{
						required: {
							value: true,
							message: 'La fecha es obligatoria.',
						},
					}}
				/>
				<FormSelect
					label='Tipo'
					name='typeLoan'
					register={register}
					errors={errors}
					mode={mode}
					onChange={(e) => setValue('typeLoan', e.target.value)}
					selectOptions={[
						{ label: 'Prestamo', value: 'Prestamo' },
						{ label: 'Adelanto', value: 'Adelanto' },
					]}
					options={{
						required: {
							value: true,
							message: 'El tipo es obligatorio.',
						},
					}}
					readOnly={mode === 'view'}
				/>
				<Form.Group className='mb-2'
					>
					<Form.Label>Monto</Form.Label>
					<InputGroup className={`items-center w-[150px] text-black ${
						mode === 'view'
							? 'border-1 border-black bg-transparent'
							: 'border-1 border-black rounded-md bg-white'
					}`}>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							type='number'
							name='valueLoan'
							{...register('valueLoan', {
								required: 'El monto es obligatorio.',
							})}
							isInvalid={!!errors.valueLoan}
							readOnly={mode === 'view'}
							placeholder='Monto'
							className='py-2'
						/>

					</InputGroup>
					<Form.Control.Feedback type='invalid'>
						{errors.valueLoan?.message}
					</Form.Control.Feedback>
				</Form.Group>

				{typeLoan !== 'Adelanto' && (
					<FormInput
						label='Cuotas'
						name='quoteLoan'
						type='number'
						register={register}
						errors={errors}
						onChange={(e) => setValue('quoteLoan', e.target.value)}
						mode={mode}
						readOnly={mode === 'view'}
					/>
				)}
				{typeLoan === 'Adelanto' ? (
					<FormInput
						label='Vencimiento'
						name='dueDates[0]'
						type='date'
						value={dueDates[0] || ''}
						onChange={(e) => handleDateChange(0, e.target.value)}
						register={register}
						errors={errors}
						mode={mode}
						readOnly={mode === 'view'}
					/>
				) : (
					dueDates.map((date, index) => {
						console.log(date);
						return (
							<FormInput
								key={index}
								label={`Vencimiento ${index + 1}`}
								name={`dueDates[${index}]`}
								type='date'
								value={date || ''}
								onChange={(e) =>
									handleDateChange(index, e.target.value)
								}
								register={register}
								errors={errors}
								mode={mode}
								readOnly={mode === 'view'}
							/>
						);
					})
				)}
				<FormInput
					label='Observaciones'
					name='text'
					type='textarea'
					register={register}
					textareaClass='true'
					errors={errors}
					mode={mode}
					readOnly={mode === 'view'}
				/>
				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Adelanto/Prestamo'
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
