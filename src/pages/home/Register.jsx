import { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import Modals from '../../utils/Modals';
import { Login } from '../../components/home/Login';
// import { useMails } from '../../hooks/useMails';
import '../../styles/Custom.css';

export const Register = () => {
	// const { sendMailRegister } = useMails();
	const { registerUser } = useAuth();
	const navigate = useNavigate();
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
	const form = useRef();
	const [showPassword, setShowPassword] = useState(false);
	const [showCoPassword, setShowCoPassword] = useState(false);

	const [openModal, setOpenModal] = useState(null);

	const toggleShowPassword = () => setShowPassword(!showPassword);
	const toggleShowCoPassword = () => setShowCoPassword(!showCoPassword);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await registerUser({ values });
			reset();
			// await sendMailRegister(values);
			navigate('/client');
		} catch (error) {
			console.error('Error al registrar el usuario:', error);
		}
	});

	return (
		<main className='flex flex-col items-center justify-center mb-5 '>
			<div className='w-[75%] flex items-center flex-col'>
				<div className='flex flex-col flex-wrap items-center justify-center p-2'>
					<h1 className='yellowtitle'>Constructor</h1>
					<h2 className='title'>Registro de Usuario</h2>
				</div>
				<Form
					id='loginFormreg'
					className='flex flex-wrap flex-row justify-around items-center w-full max-w-[700px] gap-3 rounded-xl bg-background p-5'
					onSubmit={onSubmit}
					ref={form}>
					{/* Agrupa los inputs del formulario */}
					{['nombre', 'apellido', 'cel', 'email'].map((field, index) => (
						<Form.Group className='mb-3 flex flex-col ' key={index}>
							<Form.Label className='text-start bg-transparent text-xl text-neutral-800 w-7/12 font-medium'>
								{field.charAt(0).toUpperCase() + field.slice(1)}
							</Form.Label>
							<Form.Control
								className='items-center  w-full rounded-md p-2 bg-white focus:outline-none border-2 border-black'
								type={field === 'email' ? 'email' : 'text'}
								id={field}
								name={field}
								{...register(field, {
									required: {
										value: true,
										message: `El ${
											field.charAt(0).toLowerCase() + field.slice(1)
										} es obligatorio.`,
									},
								})}
							/>
							{errors[field] && (
								<span className='error-message'>
									{errors[field].message}
								</span>
							)}
						</Form.Group>
					))}
					<div className='w-full  flex flex-row flex-wrap items-center justify-around mx-1'>
						<Form.Group className='mb-3 flex flex-col '>
							<Form.Label className='text-start bg-transparent text-xl text-neutral-800 w-10/12 font-medium'>
								Contraseña
							</Form.Label>
							<div className='flex flex-row items-center bg-neutral-200 w-full rounded-md  border-2 border-black'>
								<Form.Control
									style={{ outline: 'none', boxShadow: 'none' }}
									className='border-none'
									type={showPassword ? 'text' : 'password'}
									{...register('password', {
										required: {
											value: true,
											message: 'La contraseña es obligatoria',
										},
										minLength: {
											value: 7,
											message:
												'La contraseña debe ser mayor a 7 caracteres',
										},
									})}
								/>

								<Button
									type='button'
									onClick={toggleShowPassword}
									className='border-none bg-white text-black'>
									<i
										className={`text-xl  ${
											showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'
										}`}></i>
								</Button>
							</div>{' '}
							{errors.password && (
								<span className='error-message'>
									{errors.password.message}
								</span>
							)}
						</Form.Group>

						<Form.Group className='mb-3 flex flex-col '>
							<Form.Label
								className='text-start bg-transparent text-xl text-neutral-800  font-medium'
								id='inputconfirm'>
								Confirmar Contraseña
							</Form.Label>
							<div className='flex flex-row items-center bg-neutral-200  w-full rounded-md border-2 border-black'>
								<Form.Control
									className='border-none'
									style={{ outline: 'none', boxShadow: 'none' }}
									type={showCoPassword ? 'text' : 'password'}
									{...register('copassword', {
										required: {
											value: true,
											message:
												'La confirmacion de contraseña es obligatoria',
										},
										validate: (copassword) => {
											const { password } = getValues();
											return (
												copassword === password ||
												'Las contraseñas no coinciden'
											);
										},
									})}
								/>

								<Button
									type='button'
									onClick={toggleShowCoPassword}
									className='border-none  bg-white text-black'>
									<i
										className={`text-xl ${
											showCoPassword
												? 'pi pi-eye-slash'
												: 'pi pi-eye'
										}`}></i>
								</Button>
							</div>{' '}
							{errors.copassword && (
								<span className='error-message'>
									{errors.copassword.message}
								</span>
							)}
						</Form.Group>
					</div>

					<Form.Group className='mb-3 flex justify-center flex-col w-full items-center'>
						<Button className='m-3 w-[192px] btnprimary' type='submit'>
							<i className='text-xl pe-2 pi pi-user-plus'></i>
							Registrar cuenta
						</Button>
						<div className='flex flex-row flex-wrap items-center justify-center'>
							<p className='text-neutral-800 text-center'>
								Ya tienes una cuenta?{' '}
							</p>
							<Link
								className='link bg-transparent border-none
								hover:text-neutral-500 text-neutral-800 text-sm
								font-semibold text-decoration-underline'
								to='/'>
								Ingresar a mi cuenta
							</Link>
						</div>
					</Form.Group>
				</Form>

				{openModal === 'login' && (
					<Modals
						isOpen={openModal === 'login'}
						onClose={() => setOpenModal(null)}>
						<Login />
					</Modals>
				)}
			</div>
		</main>
	);
};
