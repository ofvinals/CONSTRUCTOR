/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import {
	FormInput,
	SaveButton,
	CancelButton,
} from '../../../../utils/Form.jsx';
import { useForm } from 'react-hook-form';
import { useToolActions } from '../../../../hooks/useToolActions.js';
import Loader from '../../../../utils/Loader.jsx';
import Avatar from 'react-avatar';

export const FormTools = ({ id, onClose, mode }) => {
	const [fileImage, setFileImage] = useState(null);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const {
		tool,
		toolStatus,
		createTool,
		getTool,
		updateTool,
		toolStatusUpdate,
	} = useToolActions();
	const [photoTool, setPhotoTool] = useState(tool?.photoTool || '');

	useEffect(() => {
		if (mode === 'edit') {
			getTool({ id });
		}
	}, [id]);

	useEffect(() => {
		if (tool && mode === 'edit') {
			setValue('name', tool.name);
			setValue('model', tool.model);
			setValue('purchaseDate', tool.purchaseDate);
			setValue('location', tool.location);
			setValue('locationId', tool.locationId);
			setValue('photoTool', tool.photoTool);
		}
	}, [tool]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoTool(reader.result);
			};
			reader.readAsDataURL(file);
			setFileImage(file);
		}
	};

	const onSubmit = handleSubmit(async (values) => {
		try {
			if (mode === 'edit') {
				await updateTool({ id, values, fileImage });
				onClose();
			} else if (mode === 'create') {
				const locationId = '';
				const updatedValues = {
					...values,
					locationId, 
				};
				await createTool({ values: updatedValues, fileImage });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar la herramienta:', error);
		}
	});

	if (toolStatus === 'Cargando' || toolStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<div className='relative'>
					{photoTool ? (
						<img
							src={photoTool}
							alt='foto de perfil'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					) : (
						<Avatar
							name={tool?.name}
							size='175'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					)}
					<input
						type='file'
						accept='image/*'
						id='profilePic'
						className='hidden'
						disabled={toolStatusUpdate === 'Cargando'}
						onChange={handleFileChange}
					/>
					<label
						htmlFor='profilePic'
						className='absolute bottom-0 right-0 w-8 h-8 bg-[#ffd52b] p-2 rounded-full cursor-pointer hover:bg-yellow-200 transition flex justify-center items-center'>
						<i className='pi pi-pencil text-black'></i>
					</label>
				</div>
				<FormInput
					label='Nombre'
					name='name'
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

				<FormInput
					label='Modelo'
					name='model'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El modelo es obligatorio.',
						},
					}}
				/>

				<FormInput
					label='Fecha de compra'
					name='purchaseDate'
					type='date'
					register={register}
					errors={errors}
					mode={mode}
				/>

				<FormInput
					label='Ubicacion'
					name='location'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					readOnly
				/>

				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Herramienta'
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
