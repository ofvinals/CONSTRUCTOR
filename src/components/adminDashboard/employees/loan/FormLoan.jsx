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
import { formatISO, parseISO } from 'date-fns';

export const FormLoan = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
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

	const typeLoan = watch('typeLoan');
	const numQuotes = watch('quoteLoan');

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getLoan({ id });
		}
	}, [id]);

	useEffect(() => {
		if (loan && (mode === 'edit' || mode === 'view')) {
			setValue('date', loan.values.date);
			setValue('employee', loan.values.employee);
			setValue('employeeId', loan.values.employeeId);
			setValue('typeLoan', loan.values.typeLoan);
			setValue('valueLoan', loan.values.valueLoan);
			setValue('quoteLoan', loan.values.quoteLoan);
			setValue('quoteDateLoan', loan.values.quoteDateLoan);
		}
	}, [loan, mode]);

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
			// Procesar los vencimientos y almacenarlos en el array `dueDates`
			const updatedDueDates = dueDates.map(
				(_, index) => values[`quoteDateLoan-${index}`] || ''
			);

			const updatedValues = {
				...values,
				dueDates: typeLoan === 'Prestamo' ? updatedDueDates : [],
			};

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
		const updatedDates = [...dueDates];
		updatedDates[index] = date;
		setDueDates(updatedDates);
	};

	if (loanStatus === 'Cargando' || loanStatusUpdate === 'Cargando') {
		return <Loader />;
	}
	console.log(loan);
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

				<FormInput
					label='Monto'
					name='valueLoan'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El monto es obligatorio.',
						},
					}}
					readOnly={mode === 'view'}
				/>

				{typeLoan !== 'Adelanto' && (
					<FormInput
						label='Cuotas'
						name='quoteLoan'
						type='number'
						register={register}
						errors={errors}
						mode={mode}
						readOnly={mode === 'view'}
					/>
				)}

				{typeLoan === 'Adelanto' ? (
					<FormInput
						label='Vencimiento'
						name='quoteDateLoan'
						type='date'
						value={dueDates[0] || ''}
						onChange={(e) => handleDateChange(0, e.target.value)}
						register={register}
						errors={errors}
						mode={mode}
						readOnly={mode === 'view'}
					/>
				) : (
					numQuotes > 0 && (
						<>
							{console.log(dueDates)}
							{dueDates.map((date, index) => (
								<FormInput
									key={index}
									label={`Vencimiento ${index + 1}`}
									name={`quoteDateLoan-${index}`}
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
							))}
						</>
					)
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
