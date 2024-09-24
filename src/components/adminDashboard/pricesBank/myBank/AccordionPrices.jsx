/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import CategoryItem from '../myBank/AccordionPrice/CategoryItem';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import '../../../../styles/Custom.css';
import HashLoader from 'react-spinners/HashLoader';

export const AccordionPrices = ({ isBudget }) => {
	const [selectedItems, setSelectedItems] = useState({ categories: {} });
	const { setItems } = usePriceActions();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState({
		categoryId: '',
		subcategoryId: '',
	});
	const {
		categories,
		statusCategory,
		createCategory,
		updateCategory,
		deleteCategory,
	} = usePriceActions();

	useEffect(() => {
		setItems(selectedItems);
		// setCategory(category)
	}, [selectedItems]);

	const getCategoryNumber = (categoryId) => {
		const index = categories.findIndex((cat) => cat.uid === categoryId) + 1;
		return index.toString();
	};

	const getSubcategoryNumber = (categoryId, subcategoryId) => {
		const category = categories.find((cat) => cat.uid === categoryId);
		const subcategoriesList = category.subcategories || [];
		const index =
			subcategoriesList.findIndex((subcat) => subcat.uid === subcategoryId) +
			1;
		return `${getCategoryNumber(categoryId)}.${index}`;
	};

	const addCategory = async () => {
		const newCategory = {
			title: 'Introduce el nombre del rubro',
			subcategories: [],
		};
		await createCategory({ values: newCategory });
	};

	const addSubcategory = async (categoryId) => {
		const newSubcategory = {
			title: 'Introduce el nombre del subrubro',
		};
		await createCategory({ categoryId, values: newSubcategory });
	};

	const handleDelete = (id) => {
		setDeleteItem(id);
		setShowConfirmDialog(true);
	};

	const confirmDelete = async () => {
		await deleteCategory({
			categoryId: deleteItem.categoryId,
			subcategoryId: deleteItem.subcategoryId,
		});
		setShowConfirmDialog(false);
		setDeleteItem({ id: '' });
	};

	const handleTitleChange = async (categoryId, id, newTitle) => {
		await updateCategory({
			categoryId,
			subcategoryId: id,
			values: { title: newTitle },
		});
	};

	const handleSelectionChange = ({
		categoryId,
		subcategoryId,
		itemId,
		isChecked,
	}) => {
		setSelectedItems((prevSelectedItems) => {
			// Hacemos una copia profunda del objeto
			const updatedSelectedItems = JSON.parse(
				JSON.stringify(prevSelectedItems)
			);

			// Asegúrate de que categories esté inicializado
			if (!updatedSelectedItems.categories) {
				updatedSelectedItems.categories = {};
			}

			if (isChecked) {
				// Lógica para seleccionar
				if (!updatedSelectedItems.categories[categoryId]) {
					updatedSelectedItems.categories[categoryId] = {
						items: [],
						subcategories: {},
					};
				}

				if (subcategoryId) {
					// Manejo de subcategoría
					if (!updatedSelectedItems.categories[categoryId].subcategories) {
						updatedSelectedItems.categories[categoryId].subcategories =
							{};
					}

					if (
						!updatedSelectedItems.categories[categoryId].subcategories[
							subcategoryId
						]
					) {
						updatedSelectedItems.categories[categoryId].subcategories[
							subcategoryId
						] = {
							items: [],
						};
					}

					// Agregar el item a la subcategoría
					const subcategoryItems =
						updatedSelectedItems.categories[categoryId].subcategories[
							subcategoryId
						].items;
					if (!subcategoryItems.includes(itemId)) {
						subcategoryItems.push(itemId);
					}
				} else {
					// Manejo de selección de categoría
					const categoryItems =
						updatedSelectedItems.categories[categoryId].items;
					if (!categoryItems.includes(itemId)) {
						categoryItems.push(itemId);
					}
				}
			} else {
				// Lógica para deseleccionar
				if (subcategoryId) {
					// Si se está deseleccionando un item dentro de una subcategoría
					const subcategory =
						updatedSelectedItems.categories[categoryId]?.subcategories?.[
							subcategoryId
						];
					if (subcategory && Array.isArray(subcategory.items)) {
						subcategory.items = subcategory.items.filter(
							(id) => id !== itemId
						);

						// Si la subcategoría queda vacía, eliminarla
						if (subcategory.items.length === 0) {
							delete updatedSelectedItems.categories[categoryId]
								.subcategories[subcategoryId];

							// Si no quedan subcategorías, eliminar la categoría
							if (
								Object.keys(
									updatedSelectedItems.categories[categoryId]
										.subcategories
								).length === 0
							) {
								delete updatedSelectedItems.categories[categoryId];
							}
						}
					}
				} else {
					// Si se está deseleccionando la categoría completa
					delete updatedSelectedItems.categories[categoryId];
				}
			}

			return updatedSelectedItems;
		});
	};

	return (
		<>
			<div>
				<Accordion defaultActiveKey='0' className='space-y-2'>
					{categories?.map((category) => (
						<CategoryItem
							key={category.uid}
							category={category}
							onAddSubcategory={addSubcategory}
							subcategories={category.subcategories || []}
							onDelete={handleDelete}
							onTitleChange={handleTitleChange}
							getCategoryNumber={getCategoryNumber}
							getSubcategoryNumber={getSubcategoryNumber}
							handleSelectionChange={handleSelectionChange}
							selectedItemsCategory={
								selectedItems?.categories[category.uid] || {
									items: [],
									subcategories: {},
								}
							}
							selectedItemsSubcategory={
								selectedItems?.categories[category.uid]
									?.subcategories || {}
							}
							isBudget={isBudget}
						/>
					))}
				</Accordion>
			</div>
			<div className='m-4'>
				{isBudget ? null : (
					<Button className='btnprimary w-[180px]' onClick={addCategory}>
						{statusCategory === 'Cargando' ? (
							<HashLoader size={25} />
						) : (
							<>
								<i className='pi pi-plus mr-2'></i>Crear Nuevo Rubro
							</>
						)}
					</Button>
				)}
			</div>
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={confirmDelete}
				message='¿Estás seguro que quieres eliminar la categoria?'
			/>
		</>
	);
};

export default AccordionPrices;
