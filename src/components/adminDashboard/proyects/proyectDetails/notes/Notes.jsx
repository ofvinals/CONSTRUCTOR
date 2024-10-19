/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'primereact/button';
import { TableNotes } from './TableNotes';
import useModal from '../../../../../hooks/useModal';
import { useProyectActions } from '../../../../../hooks/useProyectActions';
import Modals from '../../../../../utils/Modals';
import { FormNotes } from './FormNotes';
import { useAuth } from '../../../../../hooks/useAuth';
import { useBudgetActions } from '../../../../../hooks/useBudgetActions';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProyectNotesActions } from '../../../../../hooks/useProyectNotesActions';

export const Notes = () => {
	const addModal = useModal();
	const { proyects, getProyect } = useProyectActions();
	const { notes, getNotes } = useProyectNotesActions();
	const { getBudget, budget } = useBudgetActions();
	const { loggedUser } = useAuth();
	const { budgetId } = useParams();
	const [proyectId, setProyectId] = useState(null);

	useEffect(() => {
		if (proyects && budgetId) {
			const foundProyect = proyects.find(
				(proyect) => proyect.budgetId === budgetId
			);
			if (foundProyect) {
				const fetchProyect = async () => {
					setProyectId(foundProyect.uid);
					await getProyect({ proyectId: foundProyect.uid });
					await getBudget({ budgetId });
					await getNotes({ proyectId: foundProyect.uid });
				};
				fetchProyect();
			}
		}
	}, [proyects]);

	return (
		<div>
			<div className='flex flex-wrap items-center justify-between my-3 mx-2'>
				<h1 className='title'>Actas de Proyecto</h1>
				<div className='flex flex-wrap items-center justify-center md:justify-end w-full sm:w-auto mt-3 sm:mt-0'>
					<div className='ml-1 flex flex-row items-center sm:w-fit gap-2 justify-center pt-2 xs:pt-0'>
						<Button
							onClick={() => addModal.openModal()}
							className='btnprimary m-0'>
							<i className='pi pi-plus mr-2 font-bold'></i> Nuevo Acta
						</Button>
					</div>
				</div>
			</div>
			<TableNotes notes={notes} proyectId={proyectId} />s
			<Modals
				fullscreen={true}
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Nueva Acta de Proyecto'>
				<FormNotes
					onClose={addModal.closeModal}
					mode='create'
					loggedUser={loggedUser}
					budget={budget}
					proyectId={proyectId}
				/>
			</Modals>
		</div>
	);
};
