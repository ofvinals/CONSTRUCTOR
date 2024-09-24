/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useToolActions } from '../../../../hooks/useToolActions';
import Loader from '../../../../utils/Loader';

export const ToolDetails = ({ toolId }) => {
	const { getTool, tool, toolStatus } = useToolActions();

	const toolData = async () => {
		await getTool({ id: toolId });
	};

	useEffect(() => {
		toolData();
	}, [toolId]);

	if (toolStatus === 'Cargando') {
		return <Loader />;
	}

	return (
		<div>
			<div className='flex flex-col items-center justify-center'>
				<p className='text-xl font-bold'>{tool?.name}</p>
				<img
					className='my-2'
					src={tool?.photoTool}
					alt='foto de herramienta'
				/>
				<p className='my-3'>
					Ubicacion Actual: <span>{tool?.location}</span>
				</p>
			</div>
			<div className='mx-5'>
				<p className='font-semibold text-md my-2'>
					Historial de Ubicaciones
				</p>
				<ul className=' ml-3 list-disc'>
					{tool?.movementHistory?.map((movement) => (
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
		</div>
	);
};
