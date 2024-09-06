import { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import CategoryItem from './CategoryItem';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import '../../../../styles/Custom.css';
import HashLoader from 'react-spinners/HashLoader';

export const AccordionPrices = () => {
	const [selectedItems, setSelectedItems] = useState({});
	const [showDialog, setShowDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState({
		type: '',
		categoryId: '',
		subcategoryId: '',
	});
	const [loadingCategoryId, setLoadingCategoryId] = useState(null);
	const {
		categories,
		subcategories,
		statusCategory,
		createCategory,
		createSubcategory,
		getSubcategories,
		updateCategory,
		updateSubcategory,
		deleteCategory,
		deleteSubcategory,
	} = usePriceActions();
	const handleCategoryClick = async (categoryId) => {
		setLoadingCategoryId(categoryId);
		await getSubcategories({ id: categoryId });
		setLoadingCategoryId(null);
	};
	const getCategoryNumber = (categoryId) => {
		const index = categories.findIndex((cat) => cat.uid === categoryId) + 1;
		return index.toString();
	};
	const getSubcategoryNumber = (categoryId, subcategoryId) => {
		const subcategoriesList = subcategories[categoryId] || [];
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
		await createSubcategory({ values: newSubcategory, categoryId });
	};
	const handleDelete = (type, id) => {
		setDeleteItem( type, id );
		setShowDialog(true);
	};
	const confirmDelete = async () => {
		if (deleteItem.type === 'rubro') {
			await deleteCategory({ id: deleteItem.categoryId });
		} else if (deleteItem.type === 'subrubro') {
			await deleteSubcategory({
				categoryId: deleteItem.categoryId,
				subcategoryId: deleteItem.subcategoryId,
			});
		}
		setShowDialog(false);
		setDeleteItem({ type: '', id: '' });
	};
	const footerContent = (
		<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2'
				onClick={() => setShowDialog(false)}
				className='p-button-text hover:bg-red-100 p-2 rounded-md'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2'
				onClick={confirmDelete}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);
	const handleCheckboxChange = (type, id) => {
		if (type === 'rubro') {
			const category = categories.find((cat) => cat.uid === id);
			const isChecked = !selectedItems[`${type}-${id}`];
			setSelectedItems((prevSelectedItems) => {
				const updatedSelectedItems = {
					...prevSelectedItems,
					[`${type}-${id}`]: isChecked,
				};
				if (category.subcategories.length > 0) {
					category.subcategories.forEach((subcat) => {
						updatedSelectedItems[`subcategory-${subcat.uid}`] = isChecked;
					});
				}
				return updatedSelectedItems;
			});
		} else if (type === 'subrubro') {
			setSelectedItems((prevSelectedItems) => ({
				...prevSelectedItems,
				[`${type}-${id}`]: !prevSelectedItems[`${type}-${id}`],
			}));
		}
	};
	const isSelected = (type, id) => !!selectedItems[`${type}-${id}`];
	const handleTitleChange = async (type, id, newTitle, categoryId) => {
		if (type === 'rubro') {
			await updateCategory({ id, values: { title: newTitle } });
		} else if (type === 'subrubro') {
			await updateSubcategory({
				categoryId: categoryId,
				subcategoryId: id,
				values: { title: newTitle },
			});
		}
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
							subcategories={subcategories[category.uid] || []}
							onDelete={handleDelete}
							onTitleChange={handleTitleChange}
							getCategoryNumber={getCategoryNumber}
							isSelected={isSelected}
							handleCheckboxChange={() =>
								handleCheckboxChange('rubro', category.uid)
							}
							getSubcategoryNumber={getSubcategoryNumber}
							onClick={() => handleCategoryClick(category.uid)}
							loadingCategoryId={loadingCategoryId}
						/>
					))}
				</Accordion>
			</div>
			<div className='m-4'>
				<Button className='btnprimary w-[180px]' onClick={addCategory}>
					{statusCategory === 'Cargando' ? (
						<HashLoader size={25} />
					) : (
						<>
							<i className='pi pi-plus mr-2'></i>Crear Nuevo Rubro
						</>
					)}
				</Button>
			</div>
			<Dialog
				visible={showDialog}
				onHide={() => setShowDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>{`¿Estás seguro de que quieres eliminar el ${deleteItem.type}?`}</p>
			</Dialog>
		</>
	);
};

export default AccordionPrices;
