/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Avatar from 'react-avatar';
import {
	FormInput,
	SaveButton,
	CancelButton,
	FormSelect,
} from '../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import Loader from '../../../utils/Loader.jsx';
import { useUserActions } from '../../../hooks/useUserActions.js';
import { useBudgetActions } from '../../../hooks/useBudgetActions.js';

export const FormBudgets = ({ budgetId, onClose, mode }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const { users } = useUserActions();
	const {
		budget,
		getBudget,
		updateBudget,
		createBudget,
		budgetStatus,
		budgetStatusUpdate,
	} = useBudgetActions();
	const [photoProfile, setPhotoProfile] = useState(budget?.photoProfile || '');
	const [fileImage, setFileImage] = useState(null);

	useEffect(() => {
		if (mode === 'edit' ) {
			getBudget({ budgetId });
		}
	}, [budgetId]);

	useEffect(() => {
		if (budget && (mode === 'edit' )) {
			setValue('proyectName', budget.proyectName);
			setValue(
				'client',
				JSON.stringify({
					displayName: budget.client?.displayName,
					clientId: budget.client?.clientId,
				})
			);
			setValue('address', budget.address);
			setValue('description', budget.description);
			setValue('photoProfile', budget.photoProfile);
		}
	}, [budget]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoProfile(reader.result);
			};
			reader.readAsDataURL(file);
			setFileImage(file);
		}
	};

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (values.client) {
				values.client = JSON.parse(values.client);
			}
			if (mode === 'edit') {
				await updateBudget({ budgetId, values, fileImage });
				onClose();
			} else if (mode === 'create') {
				await createBudget({ values });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar el presupuesto:', error);
		}
	});

	if (budgetStatusUpdate == 'Cargando' || budgetStatus == 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<div className='relative  '>
					{photoProfile ? (
						<img
							src={photoProfile}
							alt='foto de proyecto'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					) : (
						<Avatar
							name={budget?.proyectName}
							size='175'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					)}
					<input
						type='file'
						accept='image/*'
						id='profilePic'
						className='hidden'
						disabled={budgetStatusUpdate === 'Cargando'}
						onChange={handleFileChange}
					/>
					<label
						htmlFor='profilePic'
						className='absolute bottom-0 right-0 w-8 h-8 bg-[#ffd52b] p-2 rounded-full cursor-pointer hover:bg-yellow-200 transition flex justify-center items-center'>
						<i className='pi pi-pencil text-black'></i>
					</label>
				</div>
				<FormInput
					label='Nombre del Presupuesto'
					name='proyectName'
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
				/>
				<FormSelect
					label='Cliente'
					name='client'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El cliente es obligatorio.',
						},
					}}
					selectOptions={users.map((user) => ({
						value: JSON.stringify({
							displayName: user.displayName,
							clientId: user.uid,
						}),
						label: user.displayName,
					}))}
				/>
				<FormInput
					label='Domicilio de Obra'
					name='address'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
				/>
				<FormInput
					label='Descripcion'
					name='description'
					type='textarea'
					textareaClass={true}
					register={register}
					errors={errors}
					mode={mode}
				/>
				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Crear Presupuesto'
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
