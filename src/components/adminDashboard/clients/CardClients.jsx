/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useUserActions } from '../../../hooks/UseUserActions';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Loader from '../../../utils/Loader';
import useModal from '../../../hooks/useModal';
import Modals from '../../../utils/Modals';
import { FormClients } from './FormClients';
import { Dialog } from 'primereact/dialog';
import Avatar from 'react-avatar';
import '../../../styles/Custom.css';
import { useAuth } from '../../../hooks/useAuth';

export const CardClients = ({ users }) => {
	const { allUsersStatus, disableUser, deleteUser, enableUser } =
		useUserActions();
	const { loggedUser } = useAuth();
	const [userId, setUserId] = useState(null);
	const editModal = useModal();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const handleConfirmDisable = async (uid) => {
		try {
			await disableUser({ id: uid });
		} catch (error) {
			console.error('Error al deshabilitar usuario:', error);
		}
	};

	const handleConfirmEnable = async (uid) => {
		try {
			await enableUser({ id: uid });
		} catch (error) {
			console.error('Error al habilitar usuario:', error);
		}
	};

	const handleShowDeleteConfirm = (uid) => {
		setUserId(uid);
		setShowConfirmDialog(true);
	};

	const handleDeleteUser = () => {
		if (userId) {
			deleteUser({ id: userId });
			setShowConfirmDialog(false);
		}
	};

	const footerContent = (
		<div>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2'
				onClick={() => setShowConfirmDialog(false)}
				className='p-button-text hover:bg-red-100 p-2 rounded-md'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2'
				onClick={handleDeleteUser}
				className='p-button-text hover:bg-green-100 p-2 rounded-md'
			/>
		</div>
	);

	if (allUsersStatus === 'Cargando') {
		return <Loader />;
	}

	return (
		<div className='flex flex-row flex-wrap items-center justify-around bg-background'>
			{users?.map((user) => (
				<Card
					key={user.uid}
					className='w-[330px] h-full flex flex-col border-2 border-[#ffd52b] justify-center rounded-xl m-2'>
					<div className='flex flex-row items-center justify-between'>
						{user.photoProfile ? (
							<img
								src={user.photoProfile}
								alt='foto de perfil'
								className='rounded-full m-2 h-[60px]'
							/>
						) : (
							<Avatar
								name={user.displayName}
								size='60'
								round={true}
								className='m-2'
							/>
						)}
						<h1 className='text-xl w-1/2 font-semibold m-2'>
							{user.displayName}
						</h1>
					</div>
					<div className='flex flex-col flex-grow justify-start ml-3 space-y-2'>
						<p>
							<i className='pi pi-at mr-1 font-bold'></i>
							<span>{user.email}</span>
						</p>
						<p>
							<i className='pi pi-mobile mr-1 font-bold'></i>
							<span>{user.cel}</span>
						</p>
						<p>
							<i className='pi pi-building mr-1 font-bold'></i>
							<span>{user.domicilio}</span>
						</p>
					</div>
					<div className='flex flex-row items-center justify-around my-1 gap-1 '>
						<Button
							type='button'
							onClick={() => {
								setUserId(user.uid);
								editModal.openModal();
							}}
							className='hover:bg-slate-300 p-2 rounded-md'>
							<i className='pi pi-user-edit mr-2 text-xl text-blue-500 font-bold'></i>
							Editar
						</Button>
						<Button
							onClick={
								user.isActive
									? () => handleConfirmDisable(user.uid)
									: () => handleConfirmEnable(user.uid)
							}
							className='hover:bg-slate-300 focus:shadow-outline focus:outline-none text-black p-2 rounded'>
							{user.isActive ? (
								<>
									<i className='pi pi-user-minus text-xl mr-2 text-red-500 font-bold'></i>
									Suspender
								</>
							) : (
								<>
									<i className='pi pi-user-plus text-xl mr-2 text-green-500 font-bold'></i>
									Habilitar
								</>
							)}
						</Button>
						{loggedUser.superAdmin && (
							<Button
								type='button'
								onClick={() => handleShowDeleteConfirm(user.uid)}
								className='hover:bg-slate-300 p-2 rounded-md'>
								<i className='pi pi-trash mr-1 text-red-500 font-bold'></i>
								Eliminar
							</Button>
						)}
					</div>
				</Card>
			))}
			<Modals
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Datos del Cliente'>
				<FormClients
					id={userId}
					onClose={editModal.closeModal}
					mode='edit'
				/>
			</Modals>
			<Dialog
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar este usuario?</p>
			</Dialog>
		</div>
	);
};
