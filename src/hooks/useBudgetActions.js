import { useAppDispatch, useAppSelector } from './store';
import {
	updateConfig as updateConfigThunk,
	getConfigValues as getConfigValuesThunk,
	getBudget as getBudgetThunk,
	getBudgets as getBudgetsThunk,
	createBudget as createBudgetThunk,
	duplicateBudget as duplicateBudgetThunk,
	confirmProyect as confirmProyectThunk,
	deleteBudget as deleteBudgetThunk,
	updateBudget as updateBudgetThunk,
	enableBudget as enableBudgetThunk,
	disableBudget as disableBudgetThunk,
} from '../store/budgets/thunks';
import { clearBudget } from '../store/budgets/slice';

export const useBudgetActions = () => {
	const budgets = useAppSelector((state) => state.budgets.budgets);
	const configValues = useAppSelector((state) => state.budgets.configValues);
	const allBudgetsStatus = useAppSelector((state) => state.budgets.status);
	const budget = useAppSelector((state) => state.budgets.budget);
	const budgetStatusUpdate = useAppSelector(
		(state) => state.budgets.statusUpdate
	);
	const budgetStatusDelete = useAppSelector(
		(state) => state.budgets.statusDelete
	);
	const budgetStatus = useAppSelector((state) => state.budgets.statusBudget);

	const dispatch = useAppDispatch();

	const updateConfig = async ({ budgetId, values }) => {
		await dispatch(updateConfigThunk({ budgetId, values }));
	};
	const getConfigValues = async ({ budgetId }) => {
		await dispatch(getConfigValuesThunk({ budgetId }));
	};
	const getBudget = async ({ budgetId }) => {
		await dispatch(getBudgetThunk({ budgetId }));
	};
	const getBudgets = async () => {
		await dispatch(getBudgetsThunk());
	};
	const createBudget = async ({ values, fileImage }) => {
		await dispatch(createBudgetThunk({ values, fileImage }));
	};
	const duplicateBudget = async ({ budgetId }) => {
		await dispatch(duplicateBudgetThunk({ budgetId }));
	};
	const updateBudget = async ({ budgetId, values, fileImage }) => {
		await dispatch(updateBudgetThunk({ budgetId, values, fileImage }));
	};
	const deleteBudget = async ({ budgetId }) => {
		await dispatch(deleteBudgetThunk({ budgetId }));
	};
	const disableBudget = async ({ budgetId }) => {
		await dispatch(disableBudgetThunk({ budgetId }));
	};
	const confirmProyect = async ({ budgetId }) => {
		await dispatch(confirmProyectThunk({ budgetId }));
	};

	const enableBudget = async ({ budgetId }) => {
		await dispatch(enableBudgetThunk({ budgetId }));
	};
	const clearStateBudget = () => {
		dispatch(clearBudget());
	};

	return {
		budgets,
		allBudgetsStatus,
		budgetStatusUpdate,
		budget,
		configValues,
		updateConfig,
		getConfigValues,
		getBudget,
		getBudgets,
		createBudget,
		duplicateBudget,
		deleteBudget,
		updateBudget,
		confirmProyect,
		clearStateBudget,
		budgetStatusDelete,
		budgetStatus,
		disableBudget,
		enableBudget,
	};
};
