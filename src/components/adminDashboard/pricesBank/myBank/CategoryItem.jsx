/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Accordion, Table } from 'react-bootstrap';
import SubcategoryItem from './SubCategoryItem';
import { useEffect, useState } from 'react';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../utils/Modals';
import { FormPrices } from './FormPrices';
import useModal from '../../../../hooks/useModal';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import TableActions from './TableActions';

const CategoryItem = ({
	category,
	subcategories,
	onAddSubcategory,
	onDelete,
	onTitleChange,
	isSelected,
	getCategoryNumber,
	getSubcategoryNumber,
	onClick,
}) => {
	const {
		categoryStatusUpdate,
		statusPriceCategory,
		itemsPriceCategory,
		categoryStatusDelete,
		getCategoryItemsPrice,
	} = usePriceActions();
	const newModal = useModal();
	const editModal = useModal();
	const viewModal = useModal();
	const [isOpen, setIsOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);
	const [title, setTitle] = useState(category.title);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
	const [selectedItemsCategory, setSelectedItemsCategory] = useState({});
	const [selectedItemsSubcategory, setSelectedItemsSubcategory] = useState({});
	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== category.title) {
			onTitleChange('rubro', category.uid, newTitle);
		} else return;
	};
	useEffect(() => {
		if (isOpen) {
			getCategoryItemsPrice({ categoryId: category.uid });
		}
	}, [isOpen, category.uid]);
	useEffect(() => {
		if (itemsPriceCategory?.items?.length > 0) {
			const allSelected = itemsPriceCategory.items.every(
				(item) =>
					selectedItemsCategory[category.uid]?.includes(item.uid) ||
					selectAll
			);
			setSelectAll(allSelected);
		}
	}, [itemsPriceCategory, selectedItemsCategory, selectAll]);
	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		if (itemsPriceCategory?.items) {
			itemsPriceCategory.items.forEach((item) => {
				handleCheckboxChange({
					type: 'rubro',
					categoryId: category.uid,
					itemId: item.uid,
					isChecked: newSelectAll,
				});
			});
		}
	};
	const handleItemCheckboxChange = (itemUid, isChecked) => {
		handleCheckboxChange({
			type: 'rubro',
			categoryId: category.uid,
			itemId: itemUid,
			isChecked,
		});
	};
	const handleCheckboxChange = ({
		categoryId,
		subcategoryId,
		itemId,
		isChecked,
	}) => {
		setSelectedItemsCategory((prevState) => {
			const updatedItems = { ...prevState };
			if (!updatedItems[categoryId]) {
				updatedItems[categoryId] = [];
			}
			if (isChecked) {
				// Añadir itemId si está marcado
				if (!updatedItems[categoryId].includes(itemId)) {
					updatedItems[categoryId].push(itemId);
				}
			} else {
				// Eliminar itemId si está desmarcado
				updatedItems[categoryId] = updatedItems[categoryId].filter(
					(id) => id !== itemId
				);
			}
			console.log(updatedItems);
			return updatedItems;
		});
		setSelectedItemsSubcategory((prevState) => {
			const updatedItems = { ...prevState };
			if (!updatedItems[subcategoryId]) {
				updatedItems[subcategoryId] = [];
			}
			if (isChecked) {
				// Añadir itemId si está marcado
				if (!updatedItems[subcategoryId].includes(itemId)) {
					updatedItems[subcategoryId].push(itemId);
				}
			} else {
				// Eliminar itemId si está desmarcado
				updatedItems[subcategoryId] = updatedItems[subcategoryId].filter(
					(id) => id !== itemId
				);
			}
			return updatedItems;
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
				eventKey={category.uid}
				className='custom-accordion mx-2 px-2 border-none'
				onClick={(e) => {
					setIsOpen(!isOpen), e.stopPropagation();
				}}>
				<Accordion.Header
					onClick={() => onClick(category.uid)}
					className='w-full flex flex-row items-center justify-between'>
					<div className='w-full flex flex-row flex-wrap items-center justify-between'>
						<div className='flex flex-row items-center justify-start'>
							<input
								type='checkbox'
								checked={selectAll}
								onChange={handleSelectAllChange}
								onClick={(e) => e.stopPropagation()}
								className='ml-2 rounded-md size-4'
							/>
							<input
								className='ml-2 p-2 w-[40px] bg-transparent border-none outline-none '
								type='text'
								value={`${getCategoryNumber(category.uid)} `}
								readOnly
							/>
							<input
								className='p-2 w-[300px] font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
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
								className='bg-transparent border-none flex items-end text-black'
								onClick={(e) => {
									e.stopPropagation();
									onDelete({
										type: 'rubro',
										categoryId: category.uid,
									});
								}}>
								<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
							</Button>
						</div>
					</div>
				</Accordion.Header>
				<Accordion.Body className='flex flex-col flex-wrap items-start space-y-3'>
					{statusPriceCategory === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<div className='w-full '>
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
									{itemsPriceCategory?.items?.map((item, index) => (
										<tr key={index}>
											<td>
												<input
													type='checkbox'
													checked={
														selectedItemsCategory[
															category.uid
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
											<td className='flex  items-center justify-around '>
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
					<div className='flex flex-col flex-wrap items-start justify-center gap-3'>
						<button
							type='button'
							onClick={() => {
								newModal.openModal();
							}}
							className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
							<i className='pi pi-plus text-xs font-semibold mr-2'></i>
							Nuevo Item de Rubro
						</button>
						<button
							type='button'
							className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'
							onClick={() => onAddSubcategory(category.uid)}>
							<i className='pi pi-plus text-xs font-semibold mr-2'></i>
							Nuevo SubRubro
						</button>
					</div>
					{categoryStatusUpdate === 'Cargando' ||
					categoryStatusDelete === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<div className='w-full'>
							<Accordion>
								{subcategories.map((subcategory) => (
									<SubcategoryItem
										key={subcategory.uid}
										subcategory={subcategory}
										categoryId={category.uid}
										onTitleChange={onTitleChange}
										selectedItemsSubcategory={
											selectedItemsSubcategory
										}
										onDelete={onDelete}
										isSelected={isSelected}
										handleCheckboxChange={handleCheckboxChange}
										getSubcategoryNumber={getSubcategoryNumber}
									/>
								))}
							</Accordion>
						</div>
					)}
				</Accordion.Body>
			</Accordion.Item>
			<div>
				<Modals
					fullscreen={true}
					isOpen={newModal.isOpen}
					onClose={newModal.closeModal}
					title='Ingresar Nuevo Item de Rubro'>
					<FormPrices
						onClose={newModal.closeModal}
						categoryId={category.uid}
						mode='create'
						type='category'
					/>
				</Modals>
				<Modals
					fullscreen={true}
					isOpen={editModal.isOpen}
					onClose={editModal.closeModal}
					title='Editar Item de Rubro'>
					<FormPrices
						id={itemIdToEdit}
						onClose={editModal.closeModal}
						categoryId={category.uid}
						mode='edit'
						type='category'
					/>
				</Modals>
				<Modals
					fullscreen={true}
					isOpen={viewModal.isOpen}
					onClose={viewModal.closeModal}
					title='Ver Item de Rubro'>
					<FormPrices
						id={itemIdToEdit}
						onClose={viewModal.closeModal}
						categoryId={category.uid}
						mode='view'
						type='category'
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
export default CategoryItem;
