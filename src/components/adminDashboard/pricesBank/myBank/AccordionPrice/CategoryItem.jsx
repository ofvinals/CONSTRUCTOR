/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Accordion } from 'react-bootstrap';
import SubcategoryItem from './SubCategoryItem';
import { useEffect, useState } from 'react';
import { usePriceActions } from '../../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../../utils/Modals';
import { FormPrices } from '../FormPrice/FormPrices';
import useModal from '../../../../../hooks/useModal';
import { TablePrice } from './TablePrice';

const CategoryItem = ({
	category,
	subcategories,
	onAddSubcategory,
	onDelete,
	onTitleChange,
	isSelected,
	getCategoryNumber,
	getSubcategoryNumber,
	handleSelectionChange,
	selectedItemsCategory,
	selectedItemsSubcategory,
	isBudget,
}) => {
	const {
		setSubcategories,
		setCategory,
		allCategoriesStatus,
		statusDelete,
		getItemsPrice,
	} = usePriceActions();
	const newModal = useModal();
	const [isOpen, setIsOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);
	const [title, setTitle] = useState(category.title);

	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== category.title) {
			onTitleChange(category.uid, null, newTitle);
			setTitle(newTitle);
		}
	};

	useEffect(() => {
		setCategory(category);
		setSubcategories(subcategories);
		getItemsPrice({ categoryId: category.uid });
	}, [isOpen, category.uid]);

	useEffect(() => {
		const allSelected = category.items.every(
			(item) =>
				(Array.isArray(selectedItemsCategory) &&
					selectedItemsCategory.includes(item.uid)) ||
				selectAll
		);
		setSelectAll(allSelected);
	}, [category, selectedItemsCategory, selectAll]);

	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		category.items.forEach((item) => {
			handleSelectionChange({
				categoryId: category.uid,
				itemId: item.uid,
				isChecked: newSelectAll,
			});
		});
		subcategories.forEach((subcat) => {
			subcat.items.forEach((item) => {
				handleSelectionChange({
					categoryId: category.uid,
					subcategoryId: subcat.uid,
					itemId: item.uid,
					isChecked: newSelectAll,
				});
			});
		});
	};

	const handleCheckboxChange = ({ subcategoryId, itemId, isChecked }) => {
		handleSelectionChange({
			categoryId: category.uid,
			subcategoryId,
			itemId,
			isChecked,
		});
	};

	return (
		<div>
			<Accordion.Item
				eventKey={category.uid}
				className='custom-accordion mx-2 px-2 border-none'
				onClick={(e) => {
					setIsOpen(!isOpen);
					e.stopPropagation();
				}}>
				<Accordion.Header className='w-full flex flex-row items-center justify-between'>
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
								className='ml-2 p-2 w-[30px] bg-transparent border-none outline-none '
								type='text'
								value={`${getCategoryNumber(category.uid)} `}
								readOnly
							/>
							<input
								className='p-2 font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleBlur}
								onClick={(e) => e.stopPropagation()}
								readOnly={isBudget}
							/>
						</div>
						<div>
							{isBudget ? null : (
								<div
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
								</div>
							)}
						</div>
					</div>
				</Accordion.Header>
				<Accordion.Body className='flex flex-col flex-wrap items-start space-y-2'>
					{allCategoriesStatus === 'Cargando' ||
					statusDelete === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<TablePrice
							selectedItemsCategory={selectedItemsCategory}
							selectedItemsSubcategory={selectedItemsSubcategory}
							handleCheckboxChange={handleCheckboxChange}
							category={category}
							categoryId={category.uid}
							subcategories={subcategories}
							subcategory={null}
							isBudget={isBudget}
						/>
					)}
					{isBudget ? null : (
						<div className='flex flex-col flex-wrap items-start justify-center gap-3'>
							<Button
								type='button'
								onClick={() => {
									newModal.openModal();
								}}
								className='flex items-center flex-row text-black bg-[#ffffff] border-none hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
								<i className='pi pi-plus text-xs font-semibold mr-2'></i>
								Nuevo Item de Rubro
							</Button>
							<Button
								type='button'
								className='flex items-center flex-row text-black bg-[#ffffff] border-none hover:bg-[#ffe57c] p-1 rounded-md text-sm'
								onClick={() => onAddSubcategory(category.uid)}>
								<i className='pi pi-plus text-xs font-semibold mr-2'></i>
								Nuevo SubRubro
							</Button>
						</div>
					)}
					{allCategoriesStatus === 'Cargando' ||
					statusDelete === 'Cargando' ? (
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
										isBudget={isBudget}
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
			</div>
		</div>
	);
};
export default CategoryItem;
