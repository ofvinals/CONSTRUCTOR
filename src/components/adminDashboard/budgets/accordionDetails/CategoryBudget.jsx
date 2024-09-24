/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Accordion } from 'react-bootstrap';
import SubcategoryBudget from './SubCategoryBudget';
import { useEffect, useState } from 'react';
import { useBudgetDetailsActions } from '../../../../hooks/useBudgetDetailsActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../utils/Modals';
import { FormPrices } from '../formDetailBudget/FormPrices';
import useModal from '../../../../hooks/useModal';
import { formatCurrency } from '../../../../utils/FormatCurrency';
import { TableBudget } from './TableBudget';

export const CategoryBudget = ({
	budgetId,
	category,
	subcategories,
	onAddSubcategory,
	onDelete,
	onTitleChange,
	isSelected,
	getCategoryNumber,
	getSubcategoryNumber,
	finalCategoryPrice,
}) => {
	const {
		statusUpdate,
		itemsCategory,
		statusDelete,
		allCategoriesStatus,
		getItemsPrice,
	} = useBudgetDetailsActions();
	const newModal = useModal();
	const [isOpen, setIsOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);
	const [title, setTitle] = useState(category.title);
	const [selectedItemsCategory, setSelectedItemsCategory] = useState({});
	const [selectedItemsSubcategory, setSelectedItemsSubcategory] = useState({});
	
	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== category.title) {
			onTitleChange(category.uid, null, newTitle);
		}
	};

	useEffect(() => {
		getItemsPrice({ budgetId, categoryId: category.uid });
	}, [isOpen, category.uid]);

	useEffect(() => {
		if (category?.items?.length > 0) {
			const allSelected = category.items.every(
				(item) =>
					selectedItemsCategory[category.uid]?.includes(item.uid) ||
					selectAll
			);
			setSelectAll(allSelected);
		}
	}, [itemsCategory, selectedItemsCategory, selectAll]);

	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		// Actualiza ítems de la categoría
		category.items.forEach((item) => {
			handleCheckboxChange({
				type: 'category',
				categoryId: category.uid,
				itemId: item.uid,
				isChecked: newSelectAll,
			});
		});
		// Actualiza ítems de las subcategorías
		subcategories.forEach((subcat) => {
			const subcatItems = subcat?.items || [];
			subcatItems.forEach((item) => {
				handleCheckboxChange({
					type: 'subcategory',
					categoryId: category.uid,
					subcategoryId: subcat.uid,
					itemId: item.uid,
					isChecked: newSelectAll,
				});
			});
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

	const calculateFinalPrice = (items) => {
		return items.reduce((total, item) => {
			const itemPrice = parseFloat(item.finalPrice) || 0;
			const measurement = parseFloat(item.measurement) || 1;
			return total + itemPrice * measurement;
		}, 0);
	};

	const mapedSubcategories = subcategories.map((subcategory) => {
		const items = subcategory.items || [];
		const finalPrice = calculateFinalPrice(items);
		return { ...subcategory, finalPrice };
	});

	const calculateTotalSubcategoryPrices = () => {
		const totalSubcategoryPrices =
			category?.subcategories?.reduce((total, subcategory) => {
				const finalPrice = calculateFinalPrice(subcategory.items || []);
				return total + finalPrice;
			}, 0) || 0;
		// Retorna 0 si el total de subcategorías es 0
		return totalSubcategoryPrices === 0
			? 0
			: totalSubcategoryPrices + finalCategoryPrice;
	};

	return (
		<div className=''>
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
								className='ml-2 p-2 w-[30px] bg-transparent border-none outline-none font-semibold'
								type='text'
								value={`${getCategoryNumber(category.uid)}. `}
								readOnly
							/>
							<input
								className='p-2 font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleBlur}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
						<div className='flex items-center'>
							<span className='ml-4 font-semibold'>
								Total Subrubro:
								{formatCurrency(finalCategoryPrice)}
							</span>
							{calculateTotalSubcategoryPrices() > 0 ? (
								<span className='ml-4 font-semibold'>
									Total Rubro:
									{formatCurrency(calculateTotalSubcategoryPrices())}
								</span>
							) : null}
							<div
								type='button'
								className='bg-transparent shadow-none border-none flex items-end text-black'
								onClick={(e) => {
									e.stopPropagation();
									onDelete({
										budgetId,
										categoryId: category.uid,
									});
								}}>
								<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
							</div>
						</div>
					</div>
				</Accordion.Header>
				<Accordion.Body className='flex flex-col flex-wrap items-start space-y-2 '>
					{allCategoriesStatus === 'Cargando' ||
					statusDelete === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<TableBudget
							selectedItemsCategory={selectedItemsCategory}
							selectedItemsSubcategory={selectedItemsSubcategory}
							handleCheckboxChange={handleCheckboxChange}
							budgetId={budgetId}
							category={category}
							categoryId={category.uid}
							subcategory={null}
							subcategories={subcategories}
							isSubcategory={false}
						/>
					)}
					<div className='flex flex-col flex-wrap items-start justify-center gap-3'>
						<button
							type='button'
							onClick={() => newModal.openModal()}
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
					{statusUpdate === 'Cargando' || statusDelete === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<div className='w-full'>
							<Accordion>
								{mapedSubcategories.map((subcategory) => (
									<SubcategoryBudget
										budgetId={budgetId}
										key={subcategory.uid}
										subcategory={subcategory}
										categoryId={category.uid}
										category={category}
										subcategories={subcategories}
										onTitleChange={onTitleChange}
										selectedItemsSubcategory={
											selectedItemsSubcategory
										}
										onDelete={onDelete}
										isSelected={isSelected}
										handleCheckboxChange={handleCheckboxChange}
										getSubcategoryNumber={getSubcategoryNumber}
										finalSubcategoryPrice={subcategory.finalPrice}
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
						budgetId={budgetId}
						onClose={newModal.closeModal}
						categoryId={category.uid}
						mode='create'
					/>
				</Modals>
			</div>
		</div>
	);
};
