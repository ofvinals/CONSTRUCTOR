import { useAppDispatch, useAppSelector } from './store';
import {
	exportSelectedItems as exportSelectedItemsThunk,
	getBudget as getBudgetThunk,
	getBudgets as getBudgetsThunk,
	createBudget as createBudgetThunk,
	updateBudget as updateBudgetThunk,
	deleteBudget as deleteBudgetThunk,
	getItemPrice as getItemPriceThunk,
	getItemsPrice as getItemsPriceThunk,
	createItemPrice as createItemPriceThunk,
	updateItemPrice as updateItemPriceThunk,
	deleteItemPrice as deleteItemPriceThunk,
} from '../store/budgetDetails/thunks';
import { clearCategory } from '../store/budgetDetails/slice';

export const useBudgetDetailsActions = () => {
	const categories = useAppSelector((state) => state.budgetDetails.categories);
	const category = useAppSelector((state) => state.budgetDetails.category);
	const itemPrice = useAppSelector((state) => state.budgetDetails.itemPrice);
	const allCategoriesStatus = useAppSelector(
		(state) => state.budgetDetails.status
	);
	const statusCategory = useAppSelector(
		(state) => state.budgetDetails.statusCategory
	);
	const statusSubcategory = useAppSelector(
		(state) => state.budgetDetails.statusSubcategory
	);
	const statusUpdate = useAppSelector(
		(state) => state.budgetDetails.statusUpdate
	);
	const statusDelete = useAppSelector(
		(state) => state.budgetDetails.statusDelete
	);

	const statusPriceCategory = useAppSelector(
		(state) => state.budgetDetails.statusPriceCategory
	);
	const statusPriceSubcategory = useAppSelector(
		(state) => state.budgetDetails.statusPriceSubcategory
	);

	const dispatch = useAppDispatch();
	const exportSelectedItems = async ({ selectedItems, budgetId }) => {
		await dispatch(exportSelectedItemsThunk({ selectedItems, budgetId }));
	};
	const getBudget = async ({ budgetId, categoryId }) => {
		await dispatch(getBudgetThunk({ budgetId, categoryId }));
	};
	const getBudgets = async ({ budgetId }) => {
		await dispatch(getBudgetsThunk({ budgetId }));
	};
	const createBudget = async ({ budgetId, categoryId, values }) => {
		await dispatch(createBudgetThunk({ budgetId, categoryId, values }));
	};
	const updateBudget = async ({
		budgetId,
		categoryId,
		subcategoryId,
		values,
	}) => {
		await dispatch(
			updateBudgetThunk({ budgetId, categoryId, subcategoryId, values })
		);
	};
	const deleteBudget = async ({ budgetId, categoryId, subcategoryId }) => {
		await dispatch(
			deleteBudgetThunk({ budgetId, categoryId, subcategoryId })
		);
	};

	const getItemPrice = async ({
		budgetId,
		categoryId,
		subcategoryId,
		itemId,
	}) => {
		await dispatch(
			getItemPriceThunk({
				budgetId,
				categoryId,
				subcategoryId,
				itemId,
			})
		);
	};
	const getItemsPrice = async ({ budgetId, categoryId, subcategoryId }) => {
		await dispatch(
			getItemsPriceThunk({
				budgetId,
				categoryId,
				subcategoryId,
			})
		);
	};
	const createItemPrice = async ({
		budgetId,
		categoryId,
		subcategoryId,
		values,
	}) => {
		await dispatch(
			createItemPriceThunk({
				budgetId,
				categoryId,
				subcategoryId,
				values,
			})
		);
	};

	const updateItemPrice = async ({
		budgetId,
		categoryId,
		subcategoryId,
		itemId,

		values,
	}) => {
		await dispatch(
			updateItemPriceThunk({
				budgetId,
				categoryId,
				subcategoryId,
				itemId,

				values,
			})
		);
	};
	const deleteItemPrice = async ({
		budgetId,
		categoryId,
		subcategoryId,
		itemId,
	}) => {
		await dispatch(
			deleteItemPriceThunk({
				budgetId,
				categoryId,
				subcategoryId,
				itemId,
			})
		);
	};
	const clearStateCategory = () => {
		dispatch(clearCategory());
	};

	return {
		categories,
		allCategoriesStatus,
		statusUpdate,
		statusDelete,
		category,
		statusCategory,
		statusSubcategory,
		itemPrice,
		statusPriceSubcategory,
		statusPriceCategory,
		exportSelectedItems,
		getBudget,
		getBudgets,
		createBudget,
		updateBudget,
		deleteBudget,
		clearStateCategory,
		getItemPrice,
		getItemsPrice,
		createItemPrice,
		updateItemPrice,
		deleteItemPrice,
	};
};
