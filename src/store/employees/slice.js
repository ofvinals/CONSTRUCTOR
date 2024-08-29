import { createSlice } from '@reduxjs/toolkit';
import { employeeExtraReducers } from './extraReducers';

const initialState = {
	employees: [],
	employee: null,
	config: [],
	
	status: 'Inactivo',
	statusEmployee: 'Inactivo',
	statusAuth: 'Inactivo',
	statusSign: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const employeeSlice = createSlice({
	name: 'employees',
	initialState,
	reducers: {
		clearEmployee(state) {
			state.employee = null;
		},
	},
	extraReducers: employeeExtraReducers,
});

export default employeeSlice.reducer;
export const { clearEmployee } = employeeSlice.actions;
