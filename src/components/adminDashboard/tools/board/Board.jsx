import { Kanban } from './Kanban';

export const Board = () => {
	return (
		<div>
			<div className='flex flex-wrap flex-row items-center justify-between mt-2'>
				<h1 className='title ml-4 pt-4'>Ubicacion de Herramientas</h1>
				<button className='btnprimary h-[47px]'>
					<i className='pi pi-plus mr-2'></i>Crear Nueva Ubicacion
				</button>
			</div>
			<div className='flex'>
				<Kanban />
			</div>
		</div>
	);
};
