import { createSlice } from '@reduxjs/toolkit';
import { businessExtraReducers } from './extraReducers';

const initialState = {
	business: {},
	status: 'Inactivo',
	statusBusiness: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const businessSlice = createSlice({
	name: 'business',
	initialState,
	reducers: {
		clearBusiness(state) {
			state.business = {};
		},
	},
	extraReducers: businessExtraReducers,
});

export default businessSlice.reducer;
export const { clearBusiness } = businessSlice.actions;
