import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormContact } from '../../components/home/FormContact';
import { format } from 'date-fns';

export function Footer() {
	const [formContact, setFormContact] = useState(false);

	const handleFormContact = () => {
		setFormContact(true);
	};

	const currentYear = format(new Date(), 'yyyy');

	return (
		<footer className='mt-auto w-full bg-gray-500 text-neutral-300'>
			<section className='flex flex-col items-center py-5 gap-2'>
				<div className='flex items-center'>
					<Link
						to='/'
						className='text-white text-3xl font-bold hover:opacity-80 duration-200'>
						<img src='/CONSTRU.png' alt='' width={120} />
					</Link>
				</div>
				<div className='flex flex-col lg:flex-row items-center justify-between w-full lg:px-8'>
					<div className='flex items-center gap-8 lg:w-1/3 my-3'>
						<Link
							to='https://www.facebook.com/?locale=es_LA'
							target='_blank'>
							<i className='pi pi-facebook text-xl hover:text-[#ffd52b] duration-100'></i>
						</Link>
						<Link to='https://twitter.com/?lang=es' target='_blank'>
							<i className='pi pi-twitter text-xl hover:text-[#ffd52b] duration-100'></i>
						</Link>
						<Link to='https://www.instagram.com/' target='_blank'>
							<i className='pi pi-instagram text-xl hover:text-[#ffd52b] duration-100'></i>
						</Link>
					</div>
					<p className='text-sm text-center  lg:w-1/3'>
						© {currentYear}. Constructor - Todos los derechos reservados.
					</p>
					<div className='flex items-center justify-end gap-2 text-sm lg:w-1/3'>
						<Link
							to='/users-view'
							className='hover:text-[#ffd52b] hover:underline duration-400'>
							Usuarios
						</Link>
						<p>•</p>
						<Link
							to='/about'
							className='hover:text-[#ffd52b] hover:underline duration-400'>
							Categorias
						</Link>
						<p>•</p>
						<Link
							onClick={handleFormContact}
							className='hover:text-yellow-500 hover:underline duration-400'>
							Contacto
						</Link>
						<p>•</p>
						<Link
							to='/about'
							className='hover:text-yellow-500 hover:underline duration-400'>
							Sobre Nosotros
						</Link>
					</div>
				</div>
			</section>
			{formContact && (
				<FormContact
					visible={formContact}
					onHide={() => setFormContact(false)}
				/>
			)}
		</footer>
	);
}
