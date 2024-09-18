/* eslint-disable react/prop-types */
import { useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';

export const Profile = ({ sidebarVisible }) => {
	const { loggedUser, logoutUser } = useAuth();
	const op = useRef(null);
	const navigate = useNavigate();

	const userMenuItems = [
		{
			label: 'Perfil',
			icon: 'pi pi-user',
			className:
				'rounded-md hover:bg-[#ffd52b] hover:font-bold p-1 text-black',
			command: () => {
				navigate('/profile');
				sidebarVisible(false);
			},
		},
		{
			label: 'Cerrar Sesión',
			icon: 'pi pi-sign-out',
			className:
				'rounded-md hover:bg-[#ffd52b] hover:font-bold p-1 text-black',
			command: () => {
				logoutUser();
			},
		},
	];

	return (
		<div className='flex flex-col items-center justify-center'>
			<Button
				onClick={(e) => op.current.toggle(e)}
				className='w-11 h-11 rounded-full my-3 ring-2 ring-[#ffd52b] cursor-pointer hover:opacity-60'>
				{loggedUser.photoProfile ? (
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
			<OverlayPanel ref={op} dismissable>
				<Menu model={userMenuItems} className='rounded-md ' />
			</OverlayPanel>
		</div>
	);
};
