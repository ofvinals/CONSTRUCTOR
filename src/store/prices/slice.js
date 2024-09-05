import { createSlice } from '@reduxjs/toolkit';
import { priceExtraReducers } from './extraReducers';

const initialState = {
	categories: {},
	subcategories: {},
	items: {},
	category: null,
	subcategory: null,
	itemsPriceCategory: {},
	itemsPriceSubcategory: {},
	itemPrice: null,
	status: 'Inactivo',
	statusCategory: 'Inactivo',
	statusSubcategory: 'Inactivo',
	statusUpdate: 'Inactivo',
	statusDelete: 'Inactivo',
	statusPriceCategory: 'Inactivo',
	statusPriceSubcategory: 'Inactivo',
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
