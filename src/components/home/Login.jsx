import { useAuth } from '../../hooks/useAuth';
import '../../styles/Custom.css';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControl } from 'react-bootstrap';

export function Login() {
	const { loginGoogle, loginEmail, statusSign } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword(!showPassword);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = handleSubmit(async ({ email, password }) => {
		try {
			await loginEmail({ email, password });
		} catch (error) {
			console.log(error);
		}
	});

	const handleGoogle = async (e) => {
		e.preventDefault();
		try {
			await loginGoogle();
		} catch (error) {
			console.error('Error en el inicio de sesión:', error);
		}
	};

	return (
		<main className='flex flex-col items-center justify-center mb-5'>
			<div className='w-1/2'>
				<div className='flex flex-col flex-wrap items-center justify-center p-2'>
					<h1 className='yellowtitle'>CONSTRUCTOR </h1>
					<h2 className='title'>Bienvenido de nuevo!</h2>
				</div>
				<Form
					id='loginForm'
					className='flex flex-col justify-center items-center bg-background rounded-xl py-4'
					onSubmit={onSubmit}>
					<Form.Group
						className='flex flex-col w-full items-center'
						controlId='inputemail'>
						<Form.Label
							className='text-start bg-transparent text-xl text-neutral-800 w-6/12 font-medium '
							id='email'>
							Email
						</Form.Label>
						<FormControl
							className='items-center lowercase w-8/12 rounded-md p-2 focus:outline-none border-2 border-black'
							type='email'
							name='email'
							{...register('email', {
								required: {
									value: true,
									message: 'El email es obligatorio',
								},
								pattern: {
									value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
									message: 'Email no válido',
								},
							})}
						/>
						{errors.email && (
							<span className='error-message'>
								{errors.email.message}
							</span>
						)}
					</Form.Group>

					<Form.Group className='flex flex-col w-full items-center mt-3'>
						<Form.Label className='text-start  bg-transparent text-xl text-neutral-800 w-6/12 font-medium'>
							Contraseña
						</Form.Label>
						<div className='flex flex-row justify-center w-8/12 bg-white rounded-lg border-2 border-black'>
							<FormControl
								className='items-center text-black  p-2 w-full rounded-md focus:outline-none '
								type={showPassword ? 'text' : 'password'}
								{...register('password', {
									required: {
										value: true,
										message: 'La contraseña es requerida',
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
								className=' border-none bg-transparent text-black '>
								<i
									className={`text-xl py-2 pr-4 ${
										showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'
									}`}></i>
							</Button>
						</div>
						{errors.password && (
							<span className='error-message'>
								{errors.password.message}
							</span>
						)}
					</Form.Group>

					<Form.Group className='mt-2'>
						<Button className='link bg-transparent border-none text-neutral-800 mt-2 text-sm font-semibold text-decoration-underline hover:text-yellow-500'>
							¿ Olvidaste tu contraseña ?
						</Button>
					</Form.Group>
					{statusSign === 'Cargando' ? (
						<Form.Group className='flex flex-col items-center'>
							<Button
								className='m-3 btnprimary w-[142px]  flex items-center justify-center '
								type='submit'>
								<ProgressSpinner
									style={{
										width: '30px',
										height: '30px',
									}}
									strokeWidth='8'
									fill='var(--surface-ground)'
									animationDuration='.6s'
								/>
								Cargando
							</Button>
						</Form.Group>
					) : (
						<Form.Group className='flex flex-col items-center'>
							<Button
								className='m-3 w-[150px] btnprimary flex items-center justify-center  '
								type='submit'>
								<i className='pe-2 pi pi-sign-in'></i>
								Ingresar
							</Button>
							<Button
								type='button'
								onClick={(e) => handleGoogle(e)}
								className='text-center font-semibold flex justify-center items-center text-neutral-200 bg-slate-700 border-neutral-200 border-2 p-2 mx-3 rounded-lg hover:bg-slate-500 hover:border-background hover:text-background'
								id='googleLogin'>
								<img
									className='w-7 h-7 mr-3'
									src='https://www.svgrepo.com/show/475656/google-color.svg'
									alt='google logo'
								/>
								Ingresar con Google
							</Button>
						</Form.Group>
					)}

					<p className='mt-6 text-neutral-800 text-sm text-center'>
						No tienes una cuenta?<br></br>
						<Link
							className='link bg-transparent border-none text-neutral-800 mt-2 text-sm font-semibold text-decoration-underline hover:text-yellow-500'
							to='register'>
							Registrarme ahora
						</Link>
					</p>
				</Form>
			</div>
		</main>
	);
}
