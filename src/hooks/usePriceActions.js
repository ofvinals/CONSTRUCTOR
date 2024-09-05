import { useAppDispatch, useAppSelector } from './store';
import {
	getCategory as getCategoryThunk,
	getCategories as getCategoriesThunk,
	createCategory as createCategoryThunk,
	updateCategory as updateCategoryThunk,
	deleteCategory as deleteCategoryThunk,
	getSubcategories as getSubcategoriesThunk,
	createSubcategory as createSubcategoryThunk,
	updateSubcategory as updateSubcategoryThunk,
	deleteSubcategory as deleteSubcategoryThunk,
	createItem as createItemThunk,
	updateItem as updateItemThunk,
	deleteItem as deleteItemThunk,
} from '../store/prices/thunks';
import { clearCategory } from '../store/prices/slice';

export const usePriceActions = () => {
	const categories = useAppSelector((state) => state.prices.categories);
	const subcategories = useAppSelector((state) => state.prices.subcategories);
	const category = useAppSelector((state) => state.prices.category);
	const allCategoriesStatus = useAppSelector((state) => state.prices.status);
	const statusCategory = useAppSelector(
		(state) => state.prices.statusCategory
	);
	const categoryStatusUpdate = useAppSelector(
		(state) => state.prices.statusUpdate
	);
	const categoryStatusDelete = useAppSelector(
		(state) => state.prices.statusDelete
	);
	const statusSubcategory = useAppSelector(
		(state) => state.prices.statusSubcategory
	);

	const dispatch = useAppDispatch();

	const getCategory = async ({ id }) => {
		await dispatch(getCategoryThunk({ id }));
	};

	const getCategories = async () => {
		await dispatch(getCategoriesThunk());
	};

	const createCategory = async ({ values }) => {
		await dispatch(createCategoryThunk({ values }));
	};

	const updateCategory = async ({ id, values }) => {
		await dispatch(updateCategoryThunk({ id, values }));
	};
	const deleteCategory = async ({ id }) => {
		await dispatch(deleteCategoryThunk({ id }));
	};
	const getSubcategories = async ({ id }) => {
		await dispatch(getSubcategoriesThunk({ id }));
	};

	const createSubcategory = async ({ categoryId, values }) => {
		await dispatch(createSubcategoryThunk({ categoryId, values }));
	};

	const updateSubcategory = async ({ categoryId, subcategoryId, values }) => {
		await dispatch(
			updateSubcategoryThunk({ categoryId, subcategoryId, values })
		);
	};

	const deleteSubcategory = async ({ categoryId, subcategoryId }) => {
		await dispatch(deleteSubcategoryThunk({ categoryId, subcategoryId }));
	};

	const createItem = async ({ categoryId, subcategoryId, values }) => {
		await dispatch(createItemThunk({ categoryId, subcategoryId, values }));
	};

	const updateItem = async ({ categoryId, subcategoryId, itemId, values }) => {
		await dispatch(
			updateItemThunk({ categoryId, subcategoryId, itemId, values })
		);
	};

	const deleteItem = async ({ categoryId, subcategoryId, itemId }) => {
		await dispatch(deleteItemThunk({ categoryId, subcategoryId, itemId }));
	};

	const clearStateCategory = () => {
		dispatch(clearCategory());
	};

	return {
		categories,
		subcategories,
		allCategoriesStatus,
		categoryStatusUpdate,
		categoryStatusDelete,
		category,
		statusCategory,
		getCategory,
		getCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		clearStateCategory,
		statusSubcategory,
		getSubcategories,
		createSubcategory,
		updateSubcategory,
		deleteSubcategory,
		createItem,
		updateItem,
		deleteItem,
	};
};
