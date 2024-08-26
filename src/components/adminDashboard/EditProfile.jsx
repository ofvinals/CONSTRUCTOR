import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserAction } from '../../hooks/useUserAction';
import { Link } from 'react-router-dom';

export const EditProfile = () => {
	const { loggedUser } = useAuth();
	const { updateProfile, userStatusUpdate } = useUserAction();

	const [fullName, setFullName] = useState(loggedUser?.fullName);
	const [photoProfile, setPhotoProfile] = useState(loggedUser?.photoProfile);
	const [fileImage, setFileImage] = useState(null);

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

	return (
		<div className='bg-background p-4'>
			<div className='max-w-screen-sm mx-auto bg-gray-200 rounded-lg px-8 pt-6 pb-8 mb-4'>
				<h2 className='text-2xl font-bold text-black text-center'>
					Editar perfil
				</h2>
				<div className='flex flex-col items-center mt-8'>
					<div className='relative'>
						<img
							className='object-cover w-40 h-40 p-1 rounded-full ring-2 ring-[#ffd52b]'
							src={photoProfile}
							alt={'Foto de perfil de ' + loggedUser?.fullName}
						/>
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
					<div className='mt-8 w-full sm:max-w-md'>
						<div className='mb-4'>
							<label
								className='block text-black text-sm font-bold mb-2'
								htmlFor='fullName'>
								Nombre completo
							</label>
							<input
								id='fullName'
								type='text'
								disabled={userStatusUpdate === 'Cargando'}
								className='w-full p-2 border-2 rounded-md bg-white text-black border-[#ffd52b]'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>

						<div className='flex justify-between'>
							<Link
								disabled={userStatusUpdate === 'Cargando'}
								to='/admin'
								className=' px-4 py-2 font-semibold text-[#ffd52b] bg-gray-600 hover:bg-gray-500 focus:outline-none rounded-lg flex flex-row justify-center items-center'>
								<i className='pi pi-times mr-2'></i>Cancelar
							</Link>
							<button
								type='button'
								disabled={userStatusUpdate === 'Cargando'}
								className='rounded-lg bg-[#ffd52b] font-semibold px-4 py-2 text-black hover:bg-yellow-200 focus:outline-none flex flex-row justify-center items-center'
								onClick={() => updateProfile({ fullName, fileImage })}>
								{userStatusUpdate === 'Cargando' ? (
									'Cargando'
								) : (
									<>
										<i className='pi pi-check font-semibold mr-1'></i>
										Guardar
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
