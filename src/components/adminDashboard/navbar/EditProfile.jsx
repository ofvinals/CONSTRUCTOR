/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useUserActions } from '../../../hooks/useUserActions';
import Avatar from 'react-avatar';
import { FormInput, SaveButton, CancelButton } from '../../../utils/Form';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import Loader from '../../../utils/Loader';

export const EditProfile = () => {
	const { loggedUser } = useAuth();
	const { updateUser, userStatusUpdate } = useUserActions();

	const [photoProfile, setPhotoProfile] = useState(
		loggedUser?.photoProfile || ''
	);
	const [fileImage, setFileImage] = useState(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (loggedUser) {
			setValue('nombre', loggedUser.nombre);
			setValue('apellido', loggedUser.apellido);
			setValue('domicilio', loggedUser.domicilio);
			setValue('email', loggedUser.email);
			setValue('dni', loggedUser.dni);
			setValue('cel', loggedUser.cel);
			setValue('photoProfile', loggedUser.photoProfile);
		}
	}, [loggedUser]);

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

	const onSubmit = async (values, fileImage) => {
		try {
			const { nombre, apellido } = values;
			const displayName = `${nombre} ${apellido}`;
			const updatedValues = { ...values, displayName };
			await updateUser({
				id: loggedUser.uid,
				values: updatedValues,
				fileImage,
			});
			onClose();
		} catch (error) {
			console.error('Error al editar el empleado:', error);
		}
	};

	const onClose = () => {
		window.history.back();
	};

	if (userStatusUpdate == 'Cargando') {
		return <Loader />;
	}

	return (
		<div className='bg-background p-4'>
			<div className='max-w-screen-sm mx-auto bg-gray-200 rounded-lg px-8 pt-6 pb-8 mb-4'>
				<h2 className='text-2xl font-bold text-black text-center'>
					Editar Perfil
				</h2>
				<Form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col items-center mt-8'>
					<div className='relative'>
						{photoProfile ? (
							<img
								src={photoProfile}
								alt='foto de perfil'
								className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
							/>
						) : (
							<Avatar
								name={loggedUser?.displayName}
								size='175'
								className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
							/>
						)}
						<input
							type='file'
							accept='image/*'
							id='profilePic'
							className='hidden'
							disabled={userStatusUpdate === 'Cargando'}
							onChange={handleFileChange}
						/>
						<label
							htmlFor='profilePic'
							className='absolute bottom-0 right-0 w-8 h-8 bg-[#ffd52b] p-2 rounded-full cursor-pointer hover:bg-yellow-200 transition flex justify-center items-center'>
							<i className='pi pi-pencil text-black'></i>
						</label>
					</div>
					<div className='mt-8 flex flex-row flex-wrap items-center justify-around w-full sm:max-w-md'>
						<FormInput
							label='Nombre'
							name='nombre'
							type='text'
							register={register}
							errors={errors}
							options={{
								required: {
									value: true,
									message: 'El nombre es obligatorio.',
								},
							}}
						/>
						<FormInput
							label='Apellido'
							name='apellido'
							type='text'
							register={register}
							errors={errors}
						/>
						<FormInput
							label='DNI/CUIT'
							name='dni'
							type='text'
							register={register}
							errors={errors}
							options={{
								minLength: {
									value: 8,
									message:
										'El DNI/CUIT debe contener entre 8 y 11 dígitos.',
								},
								maxLength: {
									value: 11,
									message:
										'El DNI/CUIT debe contener entre 8 y 11 dígitos.',
								},
							}}
						/>
						<FormInput
							label='Email'
							name='email'
							type='email'
							register={register}
							errors={errors}
							options={{
								required: {
									value: true,
									message: 'El email es obligatorio.',
								},
								pattern: {
									value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
									message: 'El email no es válido.',
								},
							}}
						/>
						<FormInput
							label='Domicilio'
							name='domicilio'
							type='text'
							register={register}
							errors={errors}
							options={{
								required: {
									value: true,
									message: 'El domicilio es obligatorio.',
								},
							}}
						/>
						<FormInput
							label='Celular'
							name='cel'
							type='text'
							register={register}
							errors={errors}
							options={{
								required: {
									value: true,
									message: 'El celular es obligatorio.',
								},
								minLength: {
									value: 10,
									message: 'El celular debe contener 10 dígitos.',
								},
								maxLength: {
									value: 10,
									message: 'El celular debe contener 10 dígitos.',
								},
							}}
						/>
						<Form.Group className='flex flex-wrap items-center w-full justify-around mt-4'>
							<SaveButton
								onSubmit={handleSubmit(onSubmit)}
								label='Guardar Cambios'
							/>
							<CancelButton onClose={onClose} label='Cancelar' />
						</Form.Group>
					</div>
				</Form>
			</div>
		</div>
	);
};
