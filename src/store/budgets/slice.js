import { createSlice } from '@reduxjs/toolkit';
import { budgetExtraReducers } from './extraReducers';

const initialState = {
	budgets: [],
	budget: null,
	loggedBudget: null,
	status: 'Inactivo',
	configValues: [],
	statusValues: 'Inactivo',
	statusBudget: 'Inactivo',
	statusAuth: 'Inactivo',
	statusSign: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const budgetSlice = createSlice({
	name: 'budgets',
	initialState,
	reducers: {
		clearBudget(state) {
			state.budget = null;
		},
	},
	extraReducers: budgetExtraReducers,
});

export default budgetSlice.reducer;
export const { clearBudget } = budgetSlice.actions;
