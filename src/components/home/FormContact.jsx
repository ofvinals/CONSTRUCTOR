/* eslint-disable react/prop-types */
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import '../../styles/Custom.css'

export function FormContact({ visible, onHide }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const fetchImageUrl = async () => {
		try {
			const storage = getStorage();
			const imageRef = ref(storage, '/CONSTRUCTOR.png');
			const url = await getDownloadURL(imageRef);
			return url;
		} catch (error) {
			console.error('Error al obtener la URL de la imagen:', error);
			return '';
		}
	};

	const onSubmitForm = async (data) => {
		const templateParams = {
			url: await fetchImageUrl(),
			user_name: data.email,
			user_email: data.email,
			message: data.comment,
			proyect: 'CONSTRUCTOR',
			messageLog: `Recibimos tu consulta. A la brevedad posible nos pondremos en contacto con vos!.-`,
		};
		emailjs
			.send(
				'service_iew5q2g',
				'template_fgl8bsq',
				templateParams,
				'saMzvd5sdlHj2BhYr'
			)
			.then(
				() => {
					alert('Consulta enviada correctamente');
				},
				(error) => {
					console.error('Error al enviar el correo:', error.text);
				}
			);
	};

	return (
		<div className='flex justify-center items-center'>
			<Dialog
				visible={visible}
				modal
				onHide={() => {
					onHide();
					reset();
				}}
				className='custom-dialog'
				contentStyle={{
					width: '100%',
					backgroundColor: '#efefef',
					padding: '20px',
				}}>
				<div className='flex flex-col px-3 gap-2 items-center justify-center w-full'>
					<img src="/CONSTRU.png" alt="" width={90} />
					<p className='font-bold text-3xl text-black'>
						Formulario de Contacto
					</p>
					<p className='font-semibold mb-3 text-gray-700 text-center'>
						Envia tu consulta o sugerencia y te responderemos a la
						brevedad!
					</p>
					<form
						onSubmit={handleSubmit(onSubmitForm)}
						className='w-full form-contact'>
						<div className='flex flex-col items-center justify-center mt-1 w-full'>
							<FloatLabel>
								<InputText
									id='email'
									type='email'
									className='border p-2 w-full bg-white text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fde047]'
									{...register('email', {
										required: 'El email es obligatorio',
									})}
								/>
								<label htmlFor='email' className='text-black'>
									Email
								</label>
							</FloatLabel>
							{errors.email && (
								<span className='error-message'>
									{errors.email.message}
								</span>
							)}
						</div>
						<div className='flex flex-col items-center justify-center w-full mt-4'>
							<FloatLabel className='relative w-full'>
								<InputTextarea
									id='comment'
									rows={7}
									className='border p-2 w-full bg-white text-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fde047] min-h-20'
									{...register('comment', {
										required: 'El comentario es obligatorio',
									})}
								/>
								<label htmlFor='comment' className='text-black'>
									Consulta o comentario
								</label>
							</FloatLabel>
							{errors.comment && (
								<span className='error-message'>
									{errors.comment.message}
								</span>
							)}
						</div>
						<div className='flex justify-evenly items-center mt-3'>
							<button type='submit' className='btnprimary w-44'>
								Enviar
							</button>
							<button
								onClick={() => {
									onHide();
									reset();
								}}
								className='btncancel w-44'>
								Cancelar
							</button>
						</div>
					</form>
				</div>
			</Dialog>
		</div>
	);
}
