import { createSlice } from '@reduxjs/toolkit';
import { loanExtraReducers } from './extraReducers';

const initialState = {
	loans: [],
	loan: null,
	config: [],
	dateAvailability: null,
	status: 'Inactivo',
	statusLoan: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const loanSlice = createSlice({
	name: 'loans',
	initialState,
	reducers: {
		clearLoan(state) {
			state.loan = null;
		},
	},
	extraReducers: loanExtraReducers,
});

export default loanSlice.reducer;
export const { clearLoan } = loanSlice.actions;
