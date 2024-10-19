import { createSlice } from '@reduxjs/toolkit';
import { proyectExtraReducers } from './extraReducers';

const initialState = {
	proyects: [],
	proyect: null,
	docs: [],
	status: 'Inactivo',
	statusProyect: 'Inactivo',
	statusDocs: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const proyectSlice = createSlice({
	name: 'proyects',
	initialState,
	reducers: {
		clearProyect(state) {
			state.proyect = null;
		},
	},
	extraReducers: proyectExtraReducers,
});

export default proyectSlice.reducer;
export const { clearProyect } = proyectSlice.actions;
