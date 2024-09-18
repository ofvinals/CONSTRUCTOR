import { createSlice } from '@reduxjs/toolkit';
import { priceExtraReducers } from './extraReducers';

const initialState = {
	categories: [],
	category: null,
	items: [],
	itemPrice: null,
	selectedItems: {},
	subcategories: [],
	status: 'Inactivo',
	statusCategory: 'Inactivo',
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
			state.itemPrice = null;
		},
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
		},
		setCategoryData(state, action) {
			state.category = action.payload;
		},
		setSubcategoriesData(state, action) {
			state.subcategories = action.payload;
		},
	},
	extraReducers: priceExtraReducers,
});

export default priceSlice.reducer;
export const {
	clearCategory,
	setSelectedItems,
	setCategoryData,
	setSubcategoriesData,
} = priceSlice.actions;
