/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { InputSwitch } from 'primereact/inputswitch';
import {
	FormInput,
	FormSelect,
	SaveButton,
	CancelButton,
} from '../../../../utils/Form.jsx';
import Loader from '../../../../utils/Loader.jsx';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';

export const FormAttendance = ({ id, onClose, mode }) => {
	const { employees, configState } = useEmployeeActions();
	const {
		checkDateAvailability,
		attendanceStatus,
		createAttendance,
		attendanceStatusUpdate,
	} = useAttendanceActions();
	const [employeeAttendance, setEmployeeAttendance] = useState([]);
	const [isExistingRecord, setIsExistingRecord] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setValue('date', new Date().toISOString().split('T')[0]);
		const initialAttendanceState = employees
			.filter((employee) => employee.isActive === true)
			.map((employee) => ({
				uid: employee.uid,
				displayName: employee.displayName,
				position: employee.position,
				valuePosition: '',
				attendance: false,
				rest: false,
				construction: '',
				travelCost: '',
				valueTravelCost: '',
			}));
		setEmployeeAttendance(initialAttendanceState);
	}, [id, employees, setValue]);

	const handleAttendanceChange = (uid, value) => {
		setEmployeeAttendance((prevState) =>
			prevState.map((employee) =>
				employee.uid === uid ? { ...employee, attendance: value } : employee
			)
		);
	};

	const handleRestChange = (uid, value) => {
		setEmployeeAttendance((prevState) =>
			prevState.map((employee) =>
				employee.uid === uid ? { ...employee, rest: value } : employee
			)
		);
	};

	const onSubmit = async (values) => {
		const date = values.date;
		try {
			const result = await checkDateAvailability({ date });
			if (result) {
				setIsExistingRecord(true);
			} else {
				setIsExistingRecord(false);

				const modifiedEmployees = employeeAttendance.map(
					(employee, index) => {
						const selectedTravelCost = values.employees[index]?.travelCost
							? JSON.parse(values.employees[index].travelCost)
							: { label: '', hourlyRate: '' };

						// Encontrar el valor de la posición del empleado en configState
						const positionData = configState[0].positions.find(
							(position) => position.label === employee.position
						);
						const valuePosition = positionData
							? positionData.hourlyRate
							: values.employees[index].position; 
						return {
							...employee,
							startTime: employee.attendance ? '08:00' : '',
							endTime: employee.attendance ? '17:00' : '',
							construction: values.employees[index]?.construction || '',
							travelCost: selectedTravelCost.label,
							valueTravelCost: selectedTravelCost.hourlyRate,
							valuePosition, // Aquí se asigna el valor encontrado
							rest: employee.rest,
						};
					}
				);

				const formData = {
					date: values.date,
					employees: modifiedEmployees,
				};

				await createAttendance({ values: formData });
				onClose();
			}
		} catch (error) {
			console.error('Error al verificar la asistencia:', error);
		}
	};

	useEffect(() => {
		if (isExistingRecord) {
			setShowAlert(true);
			const timer = setTimeout(() => {
				setShowAlert(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [isExistingRecord]);

	if (
		attendanceStatus === 'Cargando' ||
		attendanceStatusUpdate === 'Cargando'
	) {
		return <Loader />;
	}

	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-wrap justify-around items-center'>
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
					<div className='flex items-center flex-col '>
						<label htmlFor={`rest-${employee.uid}`} className='ml-2'>
							Descanso
						</label>
						<InputSwitch
							inputId={`rest-${employee.uid}`}
							checked={employee.rest}
							disabled={employee.attendance}
							onChange={(e) => handleRestChange(employee.uid, e.value)}
						/>
					</div>
					<div className='flex flex-row mx-5 w-full flex-wrap items-center justify-between'>
						<FormSelect
							label='Obra'
							name={`employees[${index}].construction`}
							register={register}
							errors={errors}
							attendanceClass={true}
							disabled={!employee.attendance}
							mode={mode}
							readOnly={mode === 'view'}
							selectOptions={[
								{
									value: 'Remedios de Escalada',
									label: 'Remedios de Escalada',
								},
								{
									value: 'Las Moras',
									label: 'Las Moras',
								},
								{
									value: 'Estados Unidos',
									label: 'Estados Unidos',
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
							disabled={!employee.attendance}
							readOnly={mode === 'view'}
							selectOptions={configState[0].travelCosts.map(
								(travelCost) => ({
									value: JSON.stringify({
										label: travelCost.label,
										hourlyRate: travelCost.hourlyRate,
									}),
									label: travelCost.label,
								})
							)}
						/>
					</div>
					<hr className='size-1 bg-black w-full' />
				</div>
			))}
			{showAlert && (
				<div className='alert alert-danger'>
					¡Ya existe un registro de asistencia para esta fecha!
				</div>
			)}
			<Form.Group className='flex flex-wrap items-center w-full justify-around'>
				{mode !== 'view' && (
					<SaveButton
						onSubmit={handleSubmit(onSubmit)}
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
