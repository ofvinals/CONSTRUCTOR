import { Kanban } from './Kanban';
import { useToolActions } from '../../../../hooks/useToolActions';

export const Board = () => {
	const { createLocation } = useToolActions();

	const handleAddColumn = async () => {
		const newLocation = { title: 'Nueva Ubicacion' };
		await createLocation({ values: newLocation });
	};

	return (
		<div>
			<div className='flex flex-wrap flex-row items-center justify-between mt-2'>
				<h1 className='title ml-4 pt-4'>Ubicacion de Herramientas</h1>
				<button
					onClick={handleAddColumn}
					className='btnprimary h-[47px]'>
					<i className='pi pi-plus mr-2 font-bold'></i>Crear Nueva Ubicacion
				</button>
			</div>
			<div className='flex'>
				<Kanban />
			</div>
		</div>
	);
};
