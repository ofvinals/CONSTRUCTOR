import { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import CategoryItem from './CategoryItem';
import { Button } from 'primereact/button';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import '../../../../styles/Custom.css';
import HashLoader from 'react-spinners/HashLoader';

export const AccordionPrices = () => {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
		setDeleteItem(type, id);
		setShowConfirmDialog(true);
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
		setShowConfirmDialog(false);
		setDeleteItem({ type: '', id: '' });
	};
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
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={confirmDelete}
				message='¿Estás seguro de que quieres eliminar el adelanto?'
			/>
		</>
	);
};

export default AccordionPrices;
