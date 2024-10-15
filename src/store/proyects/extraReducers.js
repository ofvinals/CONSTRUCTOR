import {
	getProyect,
	getProyects,
	createProyect,
	deleteProyect,
	updateProyect,
	enableProyect,
	disableProyect,
	getDocuments,
	createDocs,
	deleteDocs,
} from './thunks';

export const proyectExtraReducers = (builder) => {
	builder
		.addCase(getProyects.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getProyects.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.proyects = action.payload;
		})
		.addCase(getProyects.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getProyect.pending, (state) => {
			state.statusProyect = 'Cargando';
		})
		.addCase(getProyect.fulfilled, (state, action) => {
			state.statusProyect = 'Exitoso';
			state.proyect = action.payload;
		})
		.addCase(getProyect.rejected, (state, action) => {
			state.statusProyect = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createProyect.pending, (state) => {
			state.statusProyect = 'Cargando';
		})
		.addCase(createProyect.fulfilled, (state, action) => {
			state.statusProyect = 'Exitoso';
			state.proyect = action.payload;
		})
		.addCase(createProyect.rejected, (state, action) => {
			state.statusProyect = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteProyect.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteProyect.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.proyects = action.payload;
		})
		.addCase(deleteProyect.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateProyect.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateProyect.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.proyect = action.payload;
		})
		.addCase(updateProyect.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(enableProyect.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(enableProyect.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.proyects = state.proyects.map((proyect) =>
				proyect.uid === action.payload.uid ? action.payload : proyect
			);
		})
		.addCase(enableProyect.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(disableProyect.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(disableProyect.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.proyects = state.proyects.map((proyect) =>
				proyect.uid === action.payload.uid ? action.payload : proyect
			);
		})
		.addCase(disableProyect.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getDocuments.pending, (state) => {
			state.statusDocs = 'Cargando';
		})
		.addCase(getDocuments.fulfilled, (state, action) => {
			state.statusDocs = 'Exitoso';
			state.docs = action.payload;
		})
		.addCase(getDocuments.rejected, (state, action) => {
			state.statusDocs = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createDocs.pending, (state) => {
			state.statusDocs = 'Cargando';
		})
		.addCase(createDocs.fulfilled, (state, action) => {
			state.statusDocs = 'Exitoso';
			state.docs = action.payload;
		})
		.addCase(createDocs.rejected, (state, action) => {
			state.statusDocs = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteDocs.pending, (state) => {
			state.statusDocs = 'Cargando';
		})
		.addCase(deleteDocs.fulfilled, (state, action) => {
			state.statusDocs = 'Exitoso';
			state.docs = action.payload;
		})
		.addCase(deleteDocs.rejected, (state, action) => {
			state.statusDocs = 'Fallido';
			state.error = action.payload;
		});
};
