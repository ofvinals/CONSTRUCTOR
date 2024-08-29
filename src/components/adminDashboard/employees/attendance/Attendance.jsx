import { Button } from 'primereact/button';
import { TableAttendance } from './TableAttendance';
import Modals from '../../../../utils/Modals';
import { FormAttendance } from './FormAttendance';
import useModal from '../../../../hooks/useModal';

export const Attendance = () => {
	const addModal = useModal();

	return (
		<div className='min-h-screen'>
			<div className='flex flex-wrap flex-row items-center justify-between my-3 mx-2'>
				<h1 className='title'>Control de Asistencia</h1>
				<Button
					onClick={() => addModal.openModal()}
					className='btnprimary m-0'>
					<i className='pi pi-plus mr-2 font-bold'></i> Registrar
					Asistencia del Dia
				</Button>
			</div>
			<TableAttendance />
			<Modals
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Registrar Asistencia del Dia'>
				<FormAttendance onClose={addModal.closeModal} mode='create' />
			</Modals>
		</div>
	);
};
