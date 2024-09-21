import { createSlice } from '@reduxjs/toolkit';
import { toolExtraReducers } from './extraReducers';

const initialState = {
	tools: [],
	tool: null,
	status: 'Inactivo',
	statusTool: 'Inactivo',
	statusAuth: 'Inactivo',
	statusSign: 'Inactivo',
	statusDelete: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const toolSlice = createSlice({
	name: 'tools',
	initialState,
	reducers: {
		clearTool(state) {
			state.tool = null;
		},
	},
	extraReducers: toolExtraReducers,
});

export default toolSlice.reducer;
export const { clearTool } = toolSlice.actions;
