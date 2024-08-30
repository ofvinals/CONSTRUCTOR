/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useEmployeeActions } from '../../../hooks/useEmployeeActions';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Loader from '../../../utils/Loader';
import useModal from '../../../hooks/useModal';
import Modals from '../../../utils/Modals';
import { FormEmployees } from './FormEmployees';
import { Dialog } from 'primereact/dialog';
import Avatar from 'react-avatar';
import '../../../styles/Custom.css';
import { useAuth } from '../../../hooks/useAuth';
import PaginatorComponent from '../../../utils/Paginator';

export const CardEmployees = ({ employees }) => {
	const {
		allEmployeesStatus,
		disableEmployee,
		deleteEmployee,
		enableEmployee,
	} = useEmployeeActions();
	const { loggedUser } = useAuth();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [employeeId, setEmployeeId] = useState(null);
	const editModal = useModal();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const handleConfirmDisable = async (uid) => {
		try {
			await disableEmployee({ id: uid });
		} catch (error) {
			console.error('Error al deshabilitar usuario:', error);
		}
	};

	const handleConfirmEnable = async (uid) => {
		try {
			await enableEmployee({ id: uid });
		} catch (error) {
			console.error('Error al habilitar usuario:', error);
		}
	};

	const handleShowDeleteConfirm = (uid) => {
		setEmployeeId(uid);
		setShowConfirmDialog(true);
	};

	const handleDeleteEmployee = () => {
		if (employeeId) {
			deleteEmployee({ id: employeeId });
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
				onClick={handleDeleteEmployee}
				className='p-button-text hover:bg-green-100 p-2 rounded-md'
			/>
		</div>
	);

	const onPageChange = (event) => {
		setFirst(event.first);
		setRows(event.rows);
	};

	if (allEmployeesStatus === 'Cargando') {
		return <Loader />;
	}

	const paginatedEmployees = employees.slice(first, first + rows);

	return (
		<>
			<div className='flex flex-row pt-4 flex-wrap items-center justify-around bg-background'>
				{paginatedEmployees.length > 0 ? (
					paginatedEmployees.map((employee) => (
						<Card
							key={employee.uid}
							className='w-[330px] h-full flex flex-col border-2 border-[#ffd52b] justify-center rounded-xl m-2'>
							<div className='flex flex-row items-center justify-between'>
								{employee.photoProfile ? (
									<img
										src={employee.photoProfile}
										alt='foto de perfil'
										className='rounded-full m-2 h-[60px]'
									/>
								) : (
									<Avatar
										name={employee.displayName}
										size='60'
										round={true}
										className='m-2'
									/>
								)}
								<h1 className='text-xl w-1/2 font-semibold m-2'>
									{employee.displayName}
								</h1>
							</div>
							<div className='flex flex-col flex-grow justify-start ml-3 space-y-2'>
								<p>
									<i className='pi pi-briefcase mr-1 font-bold'></i>
									<span>{employee.position}</span>
								</p>
								<p>
									<i className='pi pi-mobile mr-1 font-bold'></i>
									<span>{employee.cel}</span>
								</p>
								<p>
									<i className='pi pi-building mr-1 font-bold'></i>
									<span>{employee.domicilio}</span>
								</p>
							</div>
							<div className='flex flex-row items-center justify-around my-1 gap-1 '>
								<Button
									type='button'
									onClick={() => {
										setEmployeeId(employee.uid);
										editModal.openModal();
									}}
									className='hover:bg-slate-300 p-2 rounded-md'>
									<i className='pi pi-user-edit mr-2 text-xl text-blue-500 font-bold'></i>
									Editar
								</Button>
								<Button
									onClick={
										employee.isActive
											? () => handleConfirmDisable(employee.uid)
											: () => handleConfirmEnable(employee.uid)
									}
									className='hover:bg-slate-300 focus:shadow-outline focus:outline-none text-black p-2 rounded'>
									{employee.isActive ? (
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
								{loggedUser?.superAdmin && (
									<Button
										type='button'
										onClick={() =>
											handleShowDeleteConfirm(employee.uid)
										}
										className='hover:bg-slate-300 p-2 rounded-md'>
										<i className='pi pi-trash mr-1 text-red-500 font-bold'></i>
										Eliminar
									</Button>
								)}
							</div>
						</Card>
					))
				) : (
					<div className='h-[40vh] flex items-center justify-center'>
						<p className='text-3xl font-bold'>
							No tienes empleados registrados actualmente
						</p>
					</div>
				)}
			</div>
			<PaginatorComponent
				first={first}
				rows={rows}
				totalRecords={employees.length}
				onPageChange={onPageChange}
			/>
			<Modals
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Datos del Empleado'>
				<FormEmployees
					id={employeeId}
					onClose={editModal.closeModal}
					mode='edit'
				/>
			</Modals>
			<Dialog
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar este empleado?</p>
			</Dialog>
		</>
	);
};
