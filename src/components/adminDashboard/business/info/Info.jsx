import Avatar from 'react-avatar';
import { useBusinessActions } from '../../../../hooks/useBusinessActions';
import Modals from '../../../../utils/Modals';
import { FormInfo } from './FormInfo';
import useModal from '../../../../hooks/useModal';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { FormBankInfo } from './FormBankInfo';

export const Info = () => {
	const newModal = useModal();
	const editModal = useModal();
	const bankModal = useModal();
	const [businessId, setBusinessId] = useState(null);
	const { business } = useBusinessActions();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	useEffect(() => {
		if (business === null) {
			setShowConfirmDialog(true);
		}
	}, [business]);

	const handleBankInfo = () => {
		bankModal.openModal();
	};

	return (
		<div>
			{!business ? (
				<div className='flex items-center justify-center mt-10'>
					<h1 className='title'>No existen datos disponibles</h1>
				</div>
			) : (
				<>
					<div className='flex flex-row items-center justify-between'>
						<h1 className='title'>Informacion de la empresa</h1>
						<button
							onClick={() => {
								setBusinessId(business.uid);
								editModal.openModal();
							}}
							className='btnprimary mr-2'>
							<i className='pi pi-file-edit mr-2 font-semibold'></i>Editar Datos
						</button>
					</div>
					<div className='flex flex-row items-center justify-between m-5'>
						<div className='w-1/2'>
							{business?.logoBusiness ? (
								<img
									src={business.logoBusiness}
									alt='logo de empresa'
									className='rounded-md m-2 h-[200px]'
								/>
							) : (
								<Avatar
									name={business?.name}
									size='200'
									className='m-2 rounded-md'
								/>
							)}
						</div>
						<div className='flex flex-col w-1/2'>
							<div className='flex flex-row items-center my-2'>
								<span className='mr-3'>Razon Social</span>
								<span className='font-bold text-xl'>
									{' '}
									{business?.socialName || 'Sin Informacion'}
								</span>
							</div>
							<div className='flex flex-row items-center my-2'>
								<span className='mr-3'>Nombre de Fantasia</span>
								<span className='font-bold text-xl'>
									{business?.name || 'Sin Informacion'}
								</span>
							</div>
							<div className='flex flex-row items-center my-2'>
								<span className='mr-3'>Domicilio Legal</span>
								<span className='font-bold text-xl'>
									{business?.address || 'Sin Informacion'}
								</span>
							</div>
							<div className='flex flex-row items-center my-2'>
								<span className='mr-3'>CUIT Nº </span>
								<span className='font-bold text-xl'>
									{business?.cuit || 'Sin Informacion'}
								</span>
							</div>
							<button
								onClick={() => handleBankInfo()}
								className='btnprimary'>
								<i className='pi pi-money-bill mr-2 font-semibold'></i>
								Datos Bancarios
							</button>
						</div>
					</div>
				</>
			)}
			<Modals
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Datos de la Empresa'>
				<FormInfo
					id={businessId}
					onClose={editModal.closeModal}
					mode='edit'
				/>
			</Modals>
			<Modals
				isOpen={newModal.isOpen}
				onClose={newModal.closeModal}
				title='Crear Empresa'>
				<FormInfo onClose={newModal.closeModal} mode='create' />
			</Modals>
			<Modals
				isOpen={bankModal.isOpen}
				onClose={bankModal.closeModal}
				title='Datos Bancarios'>
				<FormBankInfo onClose={bankModal.closeModal} mode='create' />
			</Modals>
			<ConfirmDialog
				header='Confirmar Alta'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={() => {
					newModal.openModal();
					setShowConfirmDialog(false);
				}}
				message='No existen datos de empresa. ¿Quieres crearla?'
			/>
		</div>
	);
};
