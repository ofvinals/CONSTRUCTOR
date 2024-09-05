import { createSlice } from '@reduxjs/toolkit';
import { priceExtraReducers } from './extraReducers';

const initialState = {
	categories: [],
	category: null,
	subcategories: {},
	subcategory: null,
	status: 'Inactivo',
	statusCategory: 'Inactivo',
	statusSubcategory: 'Inactivo',
	statusUpdate: 'Inactivo',
	statusDelete: 'Inactivo',
	error: null,
};

export const priceSlice = createSlice({
	name: 'prices',
	initialState,
	reducers: {
		clearCategory(state) {
			state.category = null;
		},
	},
	extraReducers: priceExtraReducers,
});

export default priceSlice.reducer;
export const { clearCategory } = priceSlice.actions;
