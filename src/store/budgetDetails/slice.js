import { createSlice } from '@reduxjs/toolkit';
import { budgetDetailExtraReducers } from './extraReducers';

const initialState = {
	categories: [],
	category: null,
	items: [],
	itemPrice: null,
	status: 'Inactivo',
	statusBudget: 'Inactivo',
	statusCategory: 'Inactivo',
	statusUpdate: 'Inactivo',
	statusDelete: 'Inactivo',
	statusPriceCategory: 'Inactivo',
	statusPriceSubcategory: 'Inactivo',
	error: null,
};

export const budgetDetailSlice = createSlice({
	name: 'budgetDetails',
	initialState,
	reducers: {
		clearCategory(state) {
			state.category = null;
			state.subcategory = null;
			state.itemPrice = null;
		},
	},
	extraReducers: budgetDetailExtraReducers,
});

export default budgetDetailSlice.reducer;
export const { clearCategory, setConfigValue } = budgetDetailSlice.actions;
