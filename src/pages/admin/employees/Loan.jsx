import { Button } from 'primereact/button';
import { TableLoan } from '../../../components/adminDashboard/employees/loan/TableLoan';
import Modals from '../../../utils/Modals';
import { FormLoan } from '../../../components/adminDashboard/employees/loan/FormLoan';
import useModal from '../../../hooks/useModal';

export const Loan = () => {
	const addModal = useModal();

	return (
		<div>
			<div className='flex flex-wrap flex-row items-center justify-center sm:justify-between my-3 mx-2'>
				<h1 className='title'>Adelantos/Prestamos</h1>
				<Button
					onClick={() => addModal.openModal()}
					className='btnprimary m-0'>
					<i className='pi pi-plus mr-2 font-bold'></i> Registrar
					Adelanto/Prestamo
				</Button>
			</div>
			<TableLoan />
			<Modals
				isOpen={addModal.isOpen}
				onClose={addModal.closeModal}
				title='Registrar Adelanto/Prestamo'>
				<FormLoan onClose={addModal.closeModal} mode='create' />
			</Modals>
		</div>
	);
};
