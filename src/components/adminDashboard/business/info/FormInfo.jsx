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
import { useBusinessActions } from '../../../../hooks/useBusinessActions.js';
import Loader from '../../../../utils/Loader.jsx';
import Avatar from 'react-avatar';

export const FormInfo = ({ id, onClose, mode }) => {
	const [fileImage, setFileImage] = useState(null);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const {
		business,
		businessStatus,
		createBusiness,
		getBusiness,
		updateBusiness,
		businessStatusUpdate,
	} = useBusinessActions();
	const [logoBusiness, setLogoBusiness] = useState(business?.logo || '');

	useEffect(() => {
		if (mode === 'edit') {
			getBusiness({ id });
		}
	}, [id]);

	useEffect(() => {
		if (business && mode === 'edit') {
			setValue('socialName', business.socialName || '');
			setValue('name', business.name || '');
			setValue('tel', business.tel || '');
			setValue('address', business.address || '');
			setValue('cuit', business.cuit || '');
		}
	}, [business]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		console.log(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoBusiness(reader.result);
			};
			reader.readAsDataURL(file);
			setFileImage(file);
			console.log(file);
		}
	};
	console.log(fileImage);
	const onSubmit = handleSubmit(async (values) => {
		try {
			if (mode === 'edit') {
				await updateBusiness({ id, values, fileImage });
				onClose();
			} else if (mode === 'create') {
				await createBusiness({ values, fileImage });
				onClose();
			}
		} catch (error) {
			console.error('Error al editar la info de la empresa:', error);
		}
	});

	if (businessStatus === 'Cargando' || businessStatusUpdate === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<Form
				onSubmit={onSubmit}
				className='flex flex-wrap justify-around items-center'>
				<div className='relative'>
					{logoBusiness ? (
						<img
							src={logoBusiness}
							alt='foto de perfil'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					) : (
						<Avatar
							name={business?.name}
							size='175'
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
						/>
					)}
					<input
						type='file'
						accept='image/*'
						id='profilePic'
						className='hidden'
						disabled={businessStatusUpdate === 'Cargando'}
						onChange={handleFileChange}
					/>
					<label
						htmlFor='profilePic'
						className='absolute bottom-0 right-0 w-8 h-8 bg-[#ffd52b] p-2 rounded-full cursor-pointer hover:bg-yellow-200 transition flex justify-center items-center'>
						<i className='pi pi-pencil text-black'></i>
					</label>
				</div>
				<FormInput
					label='Razon Social'
					name='socialName'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'La razon social es obligatoria.',
						},
					}}
				/>
				<FormInput
					label='Nombre de Fantasia'
					name='name'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
				/>
				<FormInput
					label='Domicilio Legal'
					name='address'
					type='text'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El domicilio legal es obligatorio.',
						},
					}}
				/>
				<FormInput
					label='Telefono'
					name='tel'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
				/>
				<FormInput
					label='CUIT Nº'
					name='cuit'
					type='number'
					register={register}
					errors={errors}
					mode={mode}
					options={{
						required: {
							value: true,
							message: 'El CUIT es obligatorio.',
						},
					}}
				/>

				<Form.Group className='flex flex-wrap items-center w-full justify-around'>
					{mode !== 'view' && (
						<SaveButton
							onSubmit={onSubmit}
							label={
								mode === 'create'
									? 'Registrar Datos'
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
