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
import { Dialog } from 'primereact/dialog';

const CategoryItem = ({
	category,
	subcategories,
	onAddSubcategory,
	onDelete,
	onTitleChange,
	isSelected,
	handleCheckboxChange,
	getCategoryNumber,
	getSubcategoryNumber,
	onClick,
}) => {
	const [title, setTitle] = useState(category.title);
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
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [itemIdToDelete, setItemIdToDelete] = useState(null);
	const [itemIdToEdit, setItemIdToEdit] = useState(null);
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

	const handleDeleteItem = () => {
		if (itemIdToDelete) {
			onDelete({ id: itemIdToDelete });
			setShowConfirmDialog(false);
		}
	};

	const footerContent = (
		<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2 '
				onClick={() => setShowConfirmDialog(false)}
				className=' hover:bg-red-100 p-2 rounded-md shadow-none focus:shadow-none'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2 shadow-none'
				onClick={handleDeleteItem}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);
	console.log(itemIdToEdit);
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
								checked={isSelected('rubro', category.uid)}
								onChange={(e) => {
									handleCheckboxChange('rubro', category.uid),
										e.stopPropagation();
								}}
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
										<th>Descripción</th>
										<th>Unidad</th>
										<th>Precio</th>
										<th className='w-[70px]'>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{itemsPriceCategory?.items?.map((item, index) => (
										<tr key={index}>
											<td>{item.shortDescription}</td>
											<td>{item.unitType}</td>
											<td>$ {item.unitPrice}</td>
											<td className='flex  items-center justify-around '>
												<Button
													className=' bg-transparent border-none py-0 mx-1'
													onClick={() => {
														editModal.openModal(),
															setItemIdToEdit(item.uid);
													}}>
													<i className='pi pi-pen-to-square font-bold text-xl text-green-500 hover:text-green-300'></i>
												</Button>
												<Button
													className=' bg-transparent border-none py-0 mx-1'
													onClick={() => {
														viewModal.openModal(),
															setItemIdToEdit(item.uid);
													}}>
													<i className='pi pi-eye font-bold text-xl text-blue-500 hover:text-blue-300'></i>
												</Button>
												<Button
													className=' bg-transparent border-none py-0 mx-1'
													onClick={() => {
														setShowConfirmDialog(true),
															setItemIdToDelete(item.uid);
													}}>
													<i className='pi pi-trash font-bold text-xl text-red-500 hover:text-red-300'></i>
												</Button>
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
						<Accordion className='w-full'>
							{subcategories.map((subcategory) => (
								<SubcategoryItem
									key={subcategory.uid}
									subcategory={subcategory}
									categoryId={category.uid}
									onTitleChange={onTitleChange}
									onDelete={onDelete}
									isSelected={isSelected}
									handleCheckboxChange={handleCheckboxChange}
									getSubcategoryNumber={getSubcategoryNumber}
								/>
							))}
						</Accordion>
					)}
				</Accordion.Body>
			</Accordion.Item>
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
			<Dialog
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar el item?</p>
			</Dialog>
		</>
	);
};

export default CategoryItem;
