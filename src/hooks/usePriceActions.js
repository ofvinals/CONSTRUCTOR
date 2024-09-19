import { useAppDispatch, useAppSelector } from './store';
import {
	getCategory as getCategoryThunk,
	getCategories as getCategoriesThunk,
	createCategory as createCategoryThunk,
	updateCategory as updateCategoryThunk,
	deleteCategory as deleteCategoryThunk,
	getItemPrice as getItemPriceThunk,
	getItemsPrice as getItemsPriceThunk,
	createItemPrice as createItemPriceThunk,
	updateItemPrice as updateItemPriceThunk,
	deleteItemPrice as deleteItemPriceThunk,
} from '../store/prices/thunks';
import {
	setSelectedItems,
	setCategoryData,
	setSubcategoriesData,
	clearCategory,
} from '../store/prices/slice';

export const usePriceActions = () => {
	const categories = useAppSelector((state) => state.prices.categories);
	const category = useAppSelector((state) => state.prices.category);
	const itemPrice = useAppSelector((state) => state.prices.itemPrice);
	const allCategoriesStatus = useAppSelector((state) => state.prices.status);
	const statusCategory = useAppSelector(
		(state) => state.prices.statusCategory
	);
	const statusSubcategory = useAppSelector(
		(state) => state.prices.statusSubcategory
	);
	const statusUpdate = useAppSelector((state) => state.prices.statusUpdate);
	const statusDelete = useAppSelector((state) => state.prices.statusDelete);
	const statusPriceCategory = useAppSelector(
		(state) => state.prices.statusPriceCategory
	);
	const statusPriceSubcategory = useAppSelector(
		(state) => state.prices.statusPriceSubcategory
	);
	const selectedItemsCategory = useAppSelector(
		(state) => state.prices.selectedItems
	);
	const subcategories = useAppSelector((state) => state.prices.subcategories);

	const dispatch = useAppDispatch();
	const setItems = (selectedItems) =>
		dispatch(setSelectedItems(selectedItems));
	const clearCurrentCategory = () => dispatch(clearCategory());
	const setCategory = (data) => dispatch(setCategoryData(data));
	const setSubcategories = (data) => dispatch(setSubcategoriesData(data));

	const getCategory = async ({ id }) => {
		await dispatch(getCategoryThunk({ id }));
	};
	const getCategories = async () => {
		await dispatch(getCategoriesThunk());
	};
	const createCategory = async ({ categoryId, values }) => {
		await dispatch(createCategoryThunk({ categoryId, values }));
	};
	const updateCategory = async ({ categoryId, subcategoryId, values }) => {
		await dispatch(
			updateCategoryThunk({ categoryId, subcategoryId, values })
		);
	};
	const deleteCategory = async ({ categoryId, subcategoryId }) => {
		await dispatch(deleteCategoryThunk({ categoryId, subcategoryId }));
	};
	const getItemPrice = async ({ categoryId, subcategoryId, itemId, type }) => {
		await dispatch(
			getItemPriceThunk({ categoryId, subcategoryId, itemId, type })
		);
	};
	const getItemsPrice = async ({ categoryId, subcategoryId }) => {
		await dispatch(getItemsPriceThunk({ categoryId, subcategoryId }));
	};
	const createItemPrice = async ({ categoryId, subcategoryId, values }) => {
		await dispatch(
			createItemPriceThunk({ categoryId, subcategoryId, values })
		);
	};
	const updateItemPrice = async ({
		categoryId,
		subcategoryId,
		itemId,
		values,
	}) => {
		await dispatch(
			updateItemPriceThunk({
				categoryId,
				subcategoryId,
				itemId,
				values,
			})
		);
	};
	const deleteItemPrice = async ({ categoryId, subcategoryId, itemId }) => {
		await dispatch(
			deleteItemPriceThunk({ categoryId, subcategoryId, itemId })
		);
	};
	const clearStateCategory = () => {
		dispatch(clearCategory());
	};

	return {
		categories,
		subcategories,
		allCategoriesStatus,
		statusUpdate,
		statusDelete,
		category,
		statusCategory,
		statusSubcategory,
		itemPrice,
		statusPriceSubcategory,
		statusPriceCategory,
		selectedItemsCategory,
		clearCurrentCategory,
		setItems,
		setCategory,
		setSubcategories,
		getCategory,
		getCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		clearStateCategory,
		getItemPrice,
		getItemsPrice,
		createItemPrice,
		updateItemPrice,
		deleteItemPrice,
	};
};
