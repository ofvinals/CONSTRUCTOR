import { useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

export const Profile = () => {
	const { loggedUser, logoutUser } = useAuth();
	const op = useRef(null);
	const navigate = useNavigate();

	const userMenuItems = [
		{
			label: 'Perfil',
			icon: 'pi pi-user',
			className: ' hover:font-bold hover:bg-yellow-200 p-2 text-black',
			command: () => {
				navigate('/profile');
			},
		},
		{
			label: 'Cerrar Sesión',
			icon: 'pi pi-sign-out',
			className: 'pt-3 hover:font-bold hover:bg-yellow-200  p-2 text-black',
			command: () => {
				logoutUser();
			},
		},
	];
	return (
		<div className='flex flex-row  items-center justify-center'>
			<Button
				onClick={(e) => op.current.toggle(e)}
				className='w-12 h-12 rounded-full m-3 ring-2 ring-yellow-500  cursor-pointer'>
				{loggedUser.photoProfiles ? (
					<img
						src={loggedUser.photoProfile}
						alt='foto de perfil'
						className='object-cover w-full h-full'
					/>
				) : (
					<Avatar
						name={loggedUser.displayName}
						size='46'
						round={true}
						className='object-cover w-full h-full'
					/>
				)}
			</Button>
			<p className='font-semibold text-wrap'>{loggedUser.displayName}</p>
			<OverlayPanel ref={op} dismissable>
				<Menu
					model={userMenuItems}
					className='mb-3 rounded-lg p-3 '
				/>
			</OverlayPanel>
		</div>
	);
};
