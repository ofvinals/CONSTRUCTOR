import { createSlice } from '@reduxjs/toolkit';
import { attendanceExtraReducers } from './extraReducers';

const initialState = {
	attendances: [],
	attendance: null,
	config: [],
	dateAvailability: null,
	status: 'Inactivo',
	statusAttendance: 'Inactivo',
	statusUpdate: 'Inactivo',
	error: null,
};

export const attendanceSlice = createSlice({
	name: 'attendances',
	initialState,
	reducers: {
		clearAttendance(state) {
			state.attendance = null;
		},
	},
	extraReducers: attendanceExtraReducers,
});

export default attendanceSlice.reducer;
export const { clearAttendance } = attendanceSlice.actions;
