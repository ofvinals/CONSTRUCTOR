import Swal from 'sweetalert2';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import emailjs from '@emailjs/browser';

export const useMails = () => {
	const fetchImageUrl = async () => {
		try {
			const storage = getStorage();
			const imageRef = ref(storage, '/CONSTRUCTOR.jpg');
			const url = await getDownloadURL(imageRef);
			return url;
		} catch (error) {
			console.error('Error al obtener la URL de la imagen:', error);
			return '';
		}
	};

	const sendMailEvent = async (values) => {
		console.log(values);
		const templateParams = {
			url: await fetchImageUrl(),
			user_name: values.user,
			user_email: values.user,
			message: values.description,
			proyect: 'CONSTRUCTOR',
			messageLog: `Recibimos el registro de tu turno.`,
		};
		console.log(templateParams);
		emailjs.send(
			'service_iew5q2g',
			'template_fgl8bsq',
			templateParams,
			'saMzvd5sdlHj2BhYr'
		);
	};

	const sendMailContact = async (values) => {
		console.log(values);
		const templateParams = {
			url: await fetchImageUrl(),
			user_name: values.user_name,
			user_email: values.user_email,
			message: values.message,
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
					Swal.fire({
						title: 'Consulta enviada correctamente',
						icon: 'success',
						confirmButtonColor: 'rgb(24 85 116)',
						confirmButtonText: 'OK',
					});
				},
				(error) => {
					console.error('Error al enviar el correo:', error.text);
				}
			);
	};

	const sendMailRegister = async (values) => {
		console.log(values);
		const templateParams = {
			url: await fetchImageUrl(),
			user_name: values.user_name,
			user_email: values.user_email,
			message: values.message,
			proyect: 'CONSTRUCTOR',
			messageLog: `Bienvenido al primer Estudio Juridico online de Tucuman. Estamos a tu disposicion para brindarte el mejor asesoramiento juridico!.-`,
		};
		emailjs.send(
			'service_iew5q2g',
			'template_fgl8bsq',
			templateParams,
			'saMzvd5sdlHj2BhYr'
		);
	};

	return {
		sendMailEvent,
		sendMailContact,
		sendMailRegister,
	};
};
