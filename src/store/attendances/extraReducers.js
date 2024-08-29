import {
	getAttendance,
	getAttendances,
	createAttendance,
	updateAttendance,
	checkDateAvailability,
} from './thunks';

export const attendanceExtraReducers = (builder) => {
	builder
		.addCase(getAttendances.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getAttendances.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.attendances = action.payload;
		})
		.addCase(getAttendances.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(getAttendance.pending, (state) => {
			state.statusAttendance = 'Cargando';
		})
		.addCase(getAttendance.fulfilled, (state, action) => {
			state.statusAttendance = 'Exitoso';
			state.attendance = action.payload;
		})
		.addCase(getAttendance.rejected, (state, action) => {
			state.statusAttendance = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(createAttendance.pending, (state) => {
			state.statusAttendance = 'Cargando';
		})
		.addCase(createAttendance.fulfilled, (state, action) => {
			state.statusAttendance = 'Exitoso';
			state.attendance = action.payload;
		})
		.addCase(createAttendance.rejected, (state, action) => {
			state.statusAttendance = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(updateAttendance.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateAttendance.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.attendance = action.payload;
		})
		.addCase(updateAttendance.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(checkDateAvailability.pending, (state) => {
			state.statusDateCheck = 'Cargando';
		})
		.addCase(checkDateAvailability.fulfilled, (state, action) => {
			state.statusDateCheck = 'Exitoso';
			state.dateAvailable = action.payload;
		})
		.addCase(checkDateAvailability.rejected, (state, action) => {
			state.statusDateCheck = 'Fallido';
			state.error = action.payload;
		});
};
