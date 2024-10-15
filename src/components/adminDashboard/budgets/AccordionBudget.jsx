/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { CategoryBudget } from '../budgets/accordionDetails/CategoryBudget';
import { Button } from 'primereact/button';
import ConfirmDialog from '../../../utils/ConfirmDialog';
import { useBudgetDetailsActions } from '../../../hooks/useBudgetDetailsActions';
import '../../../styles/Custom.css';
import HashLoader from 'react-spinners/HashLoader';
import { useParams } from 'react-router-dom';

export const AccordionBudget = () => {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState({
		categoryId: '',
		subcategoryId: '',
	});
	const { budgetId } = useParams();
	const {
		categories,
		statusCategory,
		// statusBudget,
		getBudgets,
		createBudget,
		updateBudget,
		deleteBudget,
	} = useBudgetDetailsActions();

	useEffect(() => {
		const budgetData = async () => {
			try {
				await getBudgets({ budgetId });
			} catch (error) {
				console.error(error);
			}
		};
		budgetData();
	}, []);

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
			title: 'Introduce el titulo del rubro',
			subcategories: [],
		};
		await createBudget({ budgetId, values: newCategory });
	};

	const addSubcategory = async (categoryId) => {
		const newSubcategory = {
			title: 'Introduce el titulo del subrubro',
		};
		await createBudget({
			budgetId,
			categoryId,
			values: newSubcategory,
		});
	};

	const handleDelete = (id) => {
		setDeleteItem({ budgetId, id });
		setShowConfirmDialog(true);
	};

	const confirmDelete = async () => {
		await deleteBudget({
			budgetId,
			categoryId: deleteItem.categoryId,
			subcategoryId: deleteItem.subcategoryId,
		});
		setShowConfirmDialog(false);
		setDeleteItem({ id: '' });
	};

	const handleTitleChange = async (categoryId, subcategoryId, newTitle) => {
		await updateBudget({
			budgetId,
			categoryId,
			subcategoryId,
			values: { title: newTitle },
		});
	};

	const calculateFinalPrice = (items) => {
		return items.reduce((total, item) => {
			const finalPrice = parseFloat(item.finalPrice) || 0;
			const measurement = parseFloat(item.measurement) || 1;
			return total + finalPrice * measurement;
		}, 0);
	};

	const mapedCategories = categories?.map((category) => {
		const items = category.items || [];
		const finalPrice = calculateFinalPrice(items);
		return { ...category, finalPrice };
	});

	// if (statusBudget === 'Cargando') {
	// 	return (
	// 		<div className='flex items-center justify-center my-20'>
	// 			<HashLoader />
	// 		</div>
	// 	);
	// }

	return (
		<>
			<div>
				<Accordion defaultActiveKey='0' className='space-y-2'>
					{mapedCategories?.map((category) => (
						<CategoryBudget
							key={category.uid}
							budgetId={budgetId}
							category={category}
							finalCategoryPrice={category.finalPrice}
							onAddSubcategory={addSubcategory}
							subcategories={category.subcategories || []}
							onDelete={handleDelete}
							onTitleChange={handleTitleChange}
							getCategoryNumber={getCategoryNumber}
							getSubcategoryNumber={getSubcategoryNumber}
						/>
					))}
				</Accordion>
			</div>
			<div className='m-4'>
				<Button
					type='button'
					className='btnprimary w-[180px]'
					onClick={addCategory}>
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
				message='¿Estás seguro de que quieres eliminar el rubro?'
			/>
		</>
	);
};

export default AccordionBudget;
