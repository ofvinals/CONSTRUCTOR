/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useToolActions } from '../../../../hooks/useToolActions';
import Loader from '../../../../utils/Loader';
import Avatar from 'react-avatar';
import useModal from '../../../../hooks/useModal';
import Modals from '../../../../utils/Modals';

export const ToolDetails = ({ toolId }) => {
	const { getTool, tool, toolStatus } = useToolActions();
	const photoModal = useModal();
	const toolData = async () => {
		await getTool({ id: toolId });
	};

	useEffect(() => {
		toolData();
	}, [toolId]);

	const sortedMovementHistory = tool?.movementHistory
		? [...tool.movementHistory].sort((a, b) => {
				return new Date(b.date) - new Date(a.date);
		  })
		: [];

	if (toolStatus === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<div className='flex flex-col items-center justify-center'>
				<p className='text-xl font-bold'>{tool?.name}</p>
				{tool.photoTool ? (
					<button
						className='text-center'
						type='button'
						onClick={(e) => {
							e.stopPropagation();
							photoModal.openModal();
						}}>
						<img
							src={tool.photoTool}
							alt='foto de perfil'
							className='rounded-full m-1 h-[80px]'
						/>
					</button>
				) : (
					<Avatar
						name={tool.name}
						size='80'
						round={true}
						className='m-1 text-center'
					/>
				)}
				<p className='my-3'>
					Ubicacion Actual: <span>{tool?.location}</span>
				</p>
			</div>
			<div className='mx-5'>
				<p className='font-semibold text-md my-2'>
					Historial de Ubicaciones
				</p>
				<ul className=' ml-3 list-disc'>
					{sortedMovementHistory?.map((movement) => (
						<li key={movement.uid} className='my-1'>
							<span>
								Movida el{' '}
								<span className='font-semibold'>
									{new Date(movement.date).toLocaleString()}:{' '}
								</span>
							</span>
							<span>
								De{' '}
								<span className='font-semibold'>{movement.from}</span> a{' '}
								<span className='font-semibold'>{movement.to}</span> por{' '}
								<span className='font-semibold'>
									{movement.movedBy}
								</span>
							</span>
						</li>
					))}
				</ul>
			</div>
			<Modals
				isOpen={photoModal.isOpen}
				onClose={photoModal.closeModal}
				size='md'
				title='Fotografia Ampliada'>
				<img
					src={tool.photoTool}
					alt='foto de herramienta ampliada'
					style={{ maxHeight: '90%', maxWidth: '90%' }}
				/>
			</Modals>
		</div>
	);
};
