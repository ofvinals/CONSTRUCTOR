import { createSlice } from '@reduxjs/toolkit';
import { noteExtraReducers } from './extraReducers';

const initialState = {
	notes: [],
	note: null,
	status: 'Inactivo',
	statusNote: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const noteSlice = createSlice({
	name: 'notes',
	initialState,
	reducers: {
		clearNote(state) {
			state.note = null;
		},
	},
	extraReducers: noteExtraReducers,
});

export default noteSlice.reducer;
export const { clearNote } = noteSlice.actions;
