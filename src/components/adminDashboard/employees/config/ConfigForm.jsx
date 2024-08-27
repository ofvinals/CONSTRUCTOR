/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { SaveButton, CancelButton, FormInput } from '../../../../utils/Form';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Loader from '../../../../utils/Loader';
import { useEmployeeActions } from '../../../../hooks/UseEmployeeActions';

const ConfigForm = ({ onClose }) => {
	const [workingHours, setWorkingHours] = useState('');
	const [allowance, setAllowance] = useState('');
	const [attendance, setAttendance] = useState('');
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const { config, employeeStatus, updateConfig, employeeStatusUpdate } =
		useEmployeeActions();

	useEffect(() => {
		if (config) {
			setValue('workingHours', config.workingHours);
			setValue('allowance', config.allowance);
			setValue('attendance', config.attendance);
		}
	}, [config]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await updateConfig({ values });
			onClose();
		} catch (error) {
			console.error('Error al editar la configuracion:', error);
		}
	});
	console.log(employeeStatus);
	if (employeeStatus === 'Cargando' || employeeStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<Form
			onSubmit={onSubmit}
			className='flex flex-col justify-center items-center'>
			<FormInput
				label='Posiciones de Trabajo'
				name='attendance'
				type='number'
				register={register}
				customClass={true}
				errors={errors}
				value={attendance}
				onChange={(e) => setAttendance(e.target.value)}
			/>
			<FormInput
				label='Valor Hora de Trabajo'
				name='workingHours'
				type='number'
				register={register}
				customClass={true}
				errors={errors}
				value={workingHours}
				onChange={(e) => setWorkingHours(e.target.value)}
			/>
			<FormInput
				label='Valor Viáticos'
				name='allowance'
				type='number'
				register={register}
				customClass={true}
				errors={errors}
				value={allowance}
				onChange={(e) => setAllowance(e.target.value)}
			/>
			<FormInput
				label='Valor Presentismo'
				name='attendance'
				type='number'
				register={register}
				customClass={true}
				errors={errors}
				value={attendance}
				onChange={(e) => setAttendance(e.target.value)}
			/>

			<div className='flex justify-end space-x-4'>
				<SaveButton label='Actualizar Valores' onSubmit={handleSubmit} />
				<CancelButton label='Cancelar' onClose={() => onClose()} />
			</div>
		</Form>
	);
};

export default ConfigForm;
