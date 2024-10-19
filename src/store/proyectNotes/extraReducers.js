import {
	getNote,
	getNotes,
	createNote,
	deleteNote,
	updateNote,
} from './thunks';

export const noteExtraReducers = (builder) => {
	builder
		.addCase(getNotes.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getNotes.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.notes = action.payload;
		})
		.addCase(getNotes.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getNote.pending, (state) => {
			state.statusNote = 'Cargando';
		})
		.addCase(getNote.fulfilled, (state, action) => {
			state.statusNote = 'Exitoso';
			state.note = action.payload;
		})
		.addCase(getNote.rejected, (state, action) => {
			state.statusNote = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createNote.pending, (state) => {
			state.statusNote = 'Cargando';
		})
		.addCase(createNote.fulfilled, (state, action) => {
			state.statusNote = 'Exitoso';
			state.note = action.payload;
		})
		.addCase(createNote.rejected, (state, action) => {
			state.statusNote = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteNote.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteNote.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.notes = action.payload;
		})
		.addCase(deleteNote.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateNote.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateNote.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.note = action.payload;
		})
		.addCase(updateNote.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
};
