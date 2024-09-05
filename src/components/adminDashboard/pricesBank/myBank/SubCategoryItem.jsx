/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Accordion, Table } from 'react-bootstrap';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../utils/Modals';
import useModal from '../../../../hooks/useModal';
import { FormPrices } from './FormPrices';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const SubCategoryItem = ({
	subcategory,
	categoryId,
	onTitleChange,
	onDelete,
	isSelected,
	handleCheckboxChange,
	getSubcategoryNumber,
}) => {
	const [title, setTitle] = useState(subcategory.title);
	const {
		statusPriceSubcategory,
		itemsPriceSubcategory,
		getSubcategoryItemsPrice,
		deleteItem,
	} = usePriceActions();
	const newModal = useModal();
	const editModal = useModal();
	const viewModal = useModal();
	const [isOpen, setIsOpen] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== subcategory.title) {
			onTitleChange('subrubro', subcategory.uid, newTitle, categoryId);
		}
	};

	useEffect(() => {
		if (isOpen) {
			getSubcategoryItemsPrice({
				categoryId,
				subcategoryId: subcategory.uid,
			});
		}
	}, [isOpen, categoryId, subcategory.uid]);

	const handleDeleteItem = () => {
		if (itemIdToDelete) {
			deleteItem({ id: itemIdToDelete });
			setShowConfirmDialog(false);
		}
	};
	const footerContent = (
		<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2'
				onClick={() => setShowConfirmDialog(false)}
				className='p-button-text hover:bg-red-100 p-2 rounded-md'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2'
				onClick={handleDeleteItem}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);

	return (
		<>
			<Accordion.Item
				eventKey={subcategory.uid}
				className='custom-accordion border-none mt-2 '
				onClick={(e) => {
					setIsOpen(!isOpen), e.stopPropagation();
				}}>
				<Accordion.Header className=' flex flex-row items-center justify-between '>
					<div className='w-full flex flex-row flex-wrap items-center justify-between'>
						<div className='flex flex-row items-center justify-center'>
							<input
								type='checkbox'
								checked={isSelected('subrubro', subcategory.uid)}
								onChange={(e) => {
									e.stopPropagation(),
										handleCheckboxChange('subrubro', subcategory.uid);
								}}
								className='ml-2 rounded-md size-4'
							/>
							<input
								className='ml-2 p-2 w-[45px] rounded-md outline-none bg-transparent  '
								type='text'
								value={`${getSubcategoryNumber(
									categoryId,
									subcategory.uid
								)} `}
								readOnly
							/>
							<input
								className='p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-black'
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleBlur}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
						<Button
							type='button'
							className='bg-transparent border-none flex items-end text-black'
							onClick={(e) => {
								e.stopPropagation();
								onDelete('subrubro', subcategory.uid, categoryId);
							}}>
							<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
						</Button>
					</div>
				</Accordion.Header>
				<Accordion.Body>
					{statusPriceSubcategory === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>Descripción</th>
									<th>Unidad</th>
									<th>Precio</th>
									<th className='w-[70px]'>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{itemsPriceSubcategory?.items?.map((item, index) => (
									<tr key={index}>
										<td>{item.shortDescription}</td>
										<td>{item.unitType}</td>
										<td>$ {item.unitPrice}</td>
										<td className='flex gap-4 items-center justify-around '>
											<Button
												type='button'
												className=' bg-transparent border-none'
												onClick={() => {
													editModal.openModal(),
														setItemIdToEdit(item.uid);
												}}>
												<i className='pi pi-pen-to-square font-bold text-xl text-green-500 hover:text-red-300'></i>
											</Button>
											<Button
												type='button'
												className=' bg-transparent border-none'
												onClick={() => {
													viewModal.openModal(),
														setItemIdToEdit(item.id);
												}}>
												<i className='pi pi-eye font-bold text-xl text-blue-500 hover:text-blue-300'></i>
											</Button>
											<Button
												type='button'
												className=' bg-transparent border-none'
												onClick={() => {
													setShowConfirmDialog(true),
														setItemIdToDelete(item.id);
												}}>
												<i className='pi pi-trash font-bold text-xl text-red-500 hover:text-red-300'></i>
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
					<button
						type='button'
						onClick={() => {
							newModal.openModal();
						}}
						className='mt-3 flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
						<i className='pi pi-plus text-xs font-semibold mr-2'></i>
						Nuevo Item de SubRubro
					</button>
				</Accordion.Body>
			</Accordion.Item>
			<Modals
				fullscreen={true}
				isOpen={newModal.isOpen}
				onClose={newModal.closeModal}
				title='Ingresar Nuevo Item de SubRubro'>
				<FormPrices
					onClose={newModal.closeModal}
					subcategoryId={subcategory.uid}
					categoryId={categoryId}
					mode='create'
					type='subcategory'
				/>
			</Modals>
			<Modals
				fullscreen={true}
				isOpen={editModal.isOpen}
				onClose={editModal.closeModal}
				title='Editar Item de SubRubro'>
				<FormPrices
					id={itemIdToEdit}
					onClose={editModal.closeModal}
					subcategoryId={subcategory.uid}
					categoryId={categoryId}
					mode='edit'
					type='subcategory'
				/>
			</Modals>
			<Modals
				fullscreen={true}
				isOpen={viewModal.isOpen}
				onClose={viewModal.closeModal}
				title='Ver Item de SubRubro'>
				<FormPrices
					id={itemIdToEdit}
					onClose={viewModal.closeModal}
					subcategoryId={subcategory.uid}
					categoryId={categoryId}
					mode='view'
					type='subcategory'
				/>
			</Modals>
			<Dialog
				id={itemIdToDelete}
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar el item?</p>
			</Dialog>
		</>
	);
};

export default SubCategoryItem;
