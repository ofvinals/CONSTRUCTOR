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
	getItemPrice as getItemPriceThunk,
	getCategoryItemsPrice as getCategoryItemsPriceThunk,
	getSubcategoryItemsPrice as getSubcategoryItemsPriceThunk,
	createCategoryItemPrice as createCategoryItemPriceThunk,
	createSubcategoryItemPrice as createSubcategoryItemPriceThunk,
	updateItemPrice as updateItemPriceThunk,
	deleteItemPrice as deleteItemPriceThunk,
} from '../store/prices/thunks';
import { clearCategory } from '../store/prices/slice';

export const usePriceActions = () => {
	const categories = useAppSelector((state) => state.prices.categories);
	const category = useAppSelector((state) => state.prices.category);
	const subcategories = useAppSelector((state) => state.prices.subcategories);
	const itemPrice = useAppSelector((state) => state.prices.itemPrice);
	const itemsPriceCategory = useAppSelector(
		(state) => state.prices.itemsPriceCategory
	);
	const itemsPriceSubcategory = useAppSelector(
		(state) => state.prices.itemsPriceSubcategory
	);
	const allCategoriesStatus = useAppSelector((state) => state.prices.status);
	const statusCategory = useAppSelector(
		(state) => state.prices.statusCategory
	);
	const statusSubcategory = useAppSelector(
		(state) => state.prices.statusSubcategory
	);
	const categoryStatusUpdate = useAppSelector(
		(state) => state.prices.statusUpdate
	);
	const categoryStatusDelete = useAppSelector(
		(state) => state.prices.statusDelete
	);
	const statusPriceCategory = useAppSelector(
		(state) => state.prices.statusPriceCategory
	);
	const statusPriceSubcategory = useAppSelector(
		(state) => state.prices.statusPriceSubcategory
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
	const getItemPrice = async ({ categoryId, subcategoryId, itemId, type }) => {
		await dispatch(
			getItemPriceThunk({ categoryId, subcategoryId, itemId, type })
		);
	};
	const getCategoryItemsPrice = async ({ categoryId }) => {
		await dispatch(getCategoryItemsPriceThunk({ categoryId }));
	};
	const getSubcategoryItemsPrice = async ({ categoryId, subcategoryId }) => {
		await dispatch(
			getSubcategoryItemsPriceThunk({ categoryId, subcategoryId })
		);
	};
	const createCategoryItemPrice = async ({ categoryId, values }) => {
		await dispatch(createCategoryItemPriceThunk({ categoryId, values }));
	};
	const createSubcategoryItemPrice = async ({
		categoryId,
		subcategoryId,
		values,
	}) => {
		await dispatch(
			createSubcategoryItemPriceThunk({ categoryId, subcategoryId, values })
		);
	};
	const updateItemPrice = async ({
		categoryId,
		subcategoryId,
		itemId,
		type,
		values,
	}) => {
		await dispatch(
			updateItemPriceThunk({
				categoryId,
				subcategoryId,
				itemId,
				type,
				values,
			})
		);
	};
	const deleteItemPrice = async ({
		categoryId,
		subcategoryId,
		itemId,
		type,
	}) => {
		await dispatch(
			deleteItemPriceThunk({ categoryId, subcategoryId, itemId, type })
		);
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
		statusSubcategory,
		itemPrice,
		itemsPriceCategory,
		itemsPriceSubcategory,
		statusPriceSubcategory,
		statusPriceCategory,
		getCategory,
		getCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		clearStateCategory,
		getSubcategories,
		createSubcategory,
		updateSubcategory,
		deleteSubcategory,
		getItemPrice,
		getCategoryItemsPrice,
		getSubcategoryItemsPrice,
		createCategoryItemPrice,
		createSubcategoryItemPrice,
		updateItemPrice,
		deleteItemPrice,
	};
};
