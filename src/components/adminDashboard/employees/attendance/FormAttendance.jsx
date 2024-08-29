/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { InputSwitch } from 'primereact/inputswitch';
import {
	FormInput,
	FormSelect,
	SaveButton,
	CancelButton,
} from '../../../../utils/Form.jsx';
import { useAttendanceActions } from '../../../../hooks/UseAttendanceActions.js';
import Loader from '../../../../utils/Loader.jsx';
import { useEmployeeActions } from '../../../../hooks/UseEmployeeActions.js';

export const FormAttendance = ({ id, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm();
	const {
		attendance,
		attendanceStatus,
		createAttendance,
		getAttendance,
		updateAttendance,
		attendanceStatusUpdate,
		checkDateAvailability,
	} = useAttendanceActions();
	const { employees } = useEmployeeActions();

	const [employeeAttendance, setEmployeeAttendance] = useState([]);
	const [dateExists, setDateExists] = useState(false);

	useEffect(() => {
		if (mode === 'edit' || mode === 'view') {
			getAttendance({ id });
			setValue('date', attendance.date);
			setEmployeeAttendance(attendance.employees);
		} else if (mode === 'create') {
			setValue('date', new Date().toISOString().split('T')[0]);
			const initialAttendanceState = employees
				.filter((employee) => employee.isActive === true)
				.map((employee) => ({
					uid: employee.uid,
					displayName: employee.displayName,
					position: employee.position,
					attendance: false,
					construction: '',
					travelCost: '',
				}));
			setEmployeeAttendance(initialAttendanceState);
		}
	}, [id]);

	const handleAttendanceChange = (uid, value) => {
		setEmployeeAttendance((prevState) =>
			prevState.map((employee) =>
				employee.uid === uid ? { ...employee, attendance: value } : employee
			)
		);
	};

	const checkDate = async (date) => {
		console.log(date);
		try {
			const exists = await checkDateAvailability({ date });
			console.log(exists);
			setDateExists(exists);
			if (exists) {
				setError('date', {
					type: 'manual',
					message: 'Ya existe un registro para esta fecha.',
				});
			} else {
				clearErrors('date');
			}
		} catch (error) {
			console.error('Error al verificar la fecha:', error);
		}
	};

	const onSubmit = handleSubmit(async (values) => {
		if (dateExists) {
			onClose();
			return;
		}

		const modifiedEmployees = employeeAttendance.map((employee, index) => ({
			...employee,
			startTime: employee.attendance ? '08:00' : '',
			endTime: employee.attendance ? '17:00' : '',
			construction: values.employees[index]?.construction || '',
			travelCost: values.employees[index]?.travelCost || '',
		}));
		const formData = {
			date: values.date,
			employees: modifiedEmployees,
		};
		try {
			if (mode === 'edit') {
				await updateAttendance({ id, values: formData });
				onClose();
			} else if (mode === 'create') {
				await createAttendance({ values: formData });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar la asistencia:', error);
		}
	});

	useEffect(() => {
		if (mode === 'create') {
			const date = new Date().toISOString().split('T')[0];
			checkDate(date);
		}
	}, [mode]);

	if (
		attendanceStatus === 'Cargando' ||
		attendanceStatusUpdate === 'Cargando'
	) {
		return <Loader />;
	}

	return (
		<Form
			onSubmit={onSubmit}
			className='flex flex-wrap justify-around items-center '>
			<FormInput
				label='Fecha'
				name='date'
				type='date'
				register={register}
				errors={errors}
				mode={mode}
				options={{
					required: {
						value: true,
						message: 'La fecha es obligatoria.',
					},
				}}
				readOnly={mode === 'view'}
				onChange={(e) => checkDate(e.target.value)}
			/>
			{employeeAttendance.map((employee, index) => (
				<div
					key={employee.uid}
					className='mb-3 flex flex-wrap flex-row items-center w-full justify-around'>
					<div className='flex flex-col flex-wrap items-center justify-center'>
						<label className='mr-2 font-bold'>
							{employee.displayName}
						</label>
						<label className='mr-2 text-sm'>{employee.position}</label>
					</div>
					<div className='flex items-center flex-col '>
						<label
							htmlFor={`attendance-${employee.uid}`}
							className='ml-2'>
							Asistencia
						</label>
						<InputSwitch
							inputId={`attendance-${employee.uid}`}
							checked={employee.attendance}
							onChange={(e) =>
								handleAttendanceChange(employee.uid, e.value)
							}
							disabled={mode === 'view'}
						/>
					</div>
					<div className='flex flex-row mx-5 w-full flex-wrap items-center justify-between'>
						<FormSelect
							label='Obra'
							name={`employees[${index}].construction`}
							register={register}
							errors={errors}
							attendanceClass={true}
							disabled={mode === 'view'}
							mode={mode}
							options={{
								required: {
									value: true,
									message: 'La obra es obligatoria.',
								},
							}}
							readOnly={mode === 'view'}
							selectOptions={[
								{ value: 'Casa Loma', label: 'Casa Loma' },
								{
									value: 'Country Las Flores',
									label: 'Country Las Flores',
								},
							]}
						/>
						<FormSelect
							label='Viaticos'
							name={`employees[${index}].travelCost`}
							register={register}
							attendanceClass={true}
							errors={errors}
							mode={mode}
							readOnly={mode === 'view'}
							selectOptions={[
								{ value: 'Centro', label: 'Centro' },
								{
									value: 'Yerba Buena',
									label: 'Yerba Buena',
								},
								{
									value: 'Adicional',
									label: 'Adicional',
								},
							]}
						/>
					</div>
					<hr className='size-1 bg-black w-full' />
				</div>
			))}
			<Form.Group className=' flex flex-wrap items-center w-full justify-around'>
				{mode !== 'view' && (
					<SaveButton
						onSubmit={onSubmit}
						label={mode === 'create' ? 'Registrar ' : 'Guardar Cambios'}
					/>
				)}
				<CancelButton
					onClose={onClose}
					label={mode === 'view' ? 'Volver' : 'Cancelar'}
				/>
			</Form.Group>
		</Form>
	);
};
