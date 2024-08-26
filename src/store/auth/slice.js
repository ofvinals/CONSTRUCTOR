import { createSlice } from '@reduxjs/toolkit';
import { authExtraReducers } from './extraReducers';

const initialState = {
	loggedUser: null,
	status: 'Inactivo',
	statusAuth: 'Inactivo',
	statusSign: 'Inactivo',
	error: null,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearUser(state) {
			state.loggedUser = null;
		},
	},
	extraReducers: authExtraReducers,
});

export default authSlice.reducer;
export const { clearUser } = authSlice.actions;
