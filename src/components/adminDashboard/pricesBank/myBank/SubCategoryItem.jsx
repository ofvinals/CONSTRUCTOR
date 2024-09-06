/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Accordion, Table } from 'react-bootstrap';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../utils/Modals';
import useModal from '../../../../hooks/useModal';
import { FormPrices } from './FormPrices';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { Button } from 'primereact/button';
import TableActions from './TableActions';

const SubCategoryItem = ({
	subcategory,
	categoryId,
	onTitleChange,
	onDelete,
	handleCheckboxChange,
	getSubcategoryNumber,
	selectedItemsSubcategory,
}) => {
	const {
		statusPriceSubcategory,
		itemsPriceSubcategory,
		getSubcategoryItemsPrice,
	} = usePriceActions();
	const newModal = useModal();
	const editModal = useModal();
	const viewModal = useModal();
	const [title, setTitle] = useState(subcategory.title);
	const [isOpen, setIsOpen] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		if (isOpen) {
			getSubcategoryItemsPrice({
				categoryId,
				subcategoryId: subcategory.uid,
			});
		}
	}, [isOpen, categoryId, subcategory.uid]);

	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== subcategory.title) {
			onTitleChange('subrubro', subcategory.uid, newTitle, categoryId);
		}
	};

	useEffect(() => {
		if (itemsPriceSubcategory?.items?.length > 0) {
			const allSelected = itemsPriceSubcategory.items.every(
				(item) =>
					selectedItemsSubcategory[subcategory.uid]?.includes(item.uid) ||
					selectAll
			);
			setSelectAll(allSelected);
		}
	}, [itemsPriceSubcategory, selectedItemsSubcategory, selectAll]);

	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		itemsPriceSubcategory.items.forEach((item) => {
			handleCheckboxChange({
				type: 'subrubro',
				subcategoryId: subcategory.uid,
				categoryId,
				itemId: item.uid,
				isChecked: newSelectAll,
			});
		});
	};

	const handleItemCheckboxChange = (itemId, isChecked) => {
		handleCheckboxChange({
			type: 'subrubro',
			subcategoryId: subcategory.uid,
			categoryId,
			itemId,
			isChecked,
		});
	};

	const handleDeleteItem = () => {
		if (itemIdToDelete) {
			onDelete({ id: itemIdToDelete });
			setShowConfirmDialog(false);
		}
	};

	return (
		<>
			<Accordion.Item
				eventKey={subcategory.uid}
				className='custom-accordion border-none mt-2 '
				onClick={(e) => {
					setIsOpen(!isOpen), e.stopPropagation();
				}}>
				<Accordion.Header className=' flex flex-row items-center justify-between '>
					<div className='w-full flex flex-row flex-wrap items-center justify-between '>
						<div className='flex flex-row items-center justify-center '>
							<input
								type='checkbox'
								checked={selectAll}
								onChange={handleSelectAllChange}
								onClick={(e) => e.stopPropagation()}
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
								className='p-2 w-[300px] font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-black'
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleBlur}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
						<div>
							<Button
								type='button'
								className='bg-transparent border-none flex items-end text-black shadow-none'
								onClick={(e) => {
									e.stopPropagation();
									onDelete({
										type: 'subrubro',
										categoryId,
										subcategoryId: subcategory.uid,
									});
								}}>
								<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
							</Button>
						</div>
					</div>
				</Accordion.Header>
				<Accordion.Body>
					{statusPriceSubcategory === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<div>
							<Table striped bordered hover responsive>
								<thead>
									<tr>
										<th>#</th>
										<th>Descripción</th>
										<th>Unidad</th>
										<th>Precio</th>
										<th className='w-[70px]'>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{itemsPriceSubcategory?.items?.map((item, index) => (
										<tr key={index}>
											<td>
												<input
													type='checkbox'
													checked={
														selectedItemsSubcategory[
															subcategory.uid
														]?.includes(item.uid) || false
													}
													onClick={(e) => e.stopPropagation()}
													onChange={(e) =>
														handleItemCheckboxChange(
															item.uid,
															e.target.checked
														)
													}
													className='ml-2 rounded-md size-4'
												/>
											</td>
											<td>{item.shortDescription}</td>
											<td>{item.unitType}</td>
											<td>$ {item.unitPrice}</td>
											<td className='flex gap-4 items-center justify-around '>
												<TableActions
													onEdit={() => {
														editModal.openModal(),
															setItemIdToEdit(item.uid);
													}}
													onView={() => {
														viewModal.openModal(),
															setItemIdToEdit(item.uid);
													}}
													onDelete={() => {
														setShowConfirmDialog(true),
															setItemIdToDelete(item.uid);
													}}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					)}
					<div>
						<Button
							type='button'
							onClick={() => {
								newModal.openModal();
							}}
							className='mt-3 flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
							<i className='pi pi-plus text-xs font-semibold mr-2'></i>
							Nuevo Item de SubRubro
						</Button>
					</div>
				</Accordion.Body>
			</Accordion.Item>
			<div>
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
				<ConfirmDialog
					header='Confirmar Eliminacion'
					visible={showConfirmDialog}
					onHide={() => setShowConfirmDialog(false)}
					onConfirm={handleDeleteItem}
					message='¿Estás seguro de que quieres eliminar el item?'
				/>
			</div>
		</>
	);
};

export default SubCategoryItem;
