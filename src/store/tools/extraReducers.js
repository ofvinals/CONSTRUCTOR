import {
	getTool,
	getTools,
	createTool,
	deleteTool,
	updateTool,
	getLocations,
	createLocation,
	deleteLocation,
	updateLocation,
} from './thunks';

export const toolExtraReducers = (builder) => {
	builder
		.addCase(getTools.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getTools.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.tools = action.payload;
		})
		.addCase(getTools.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getTool.pending, (state) => {
			state.statusTool = 'Cargando';
		})
		.addCase(getTool.fulfilled, (state, action) => {
			state.statusTool = 'Exitoso';
			state.tool = action.payload;
		})
		.addCase(getTool.rejected, (state, action) => {
			state.statusTool = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createTool.pending, (state) => {
			state.statusTool = 'Cargando';
		})
		.addCase(createTool.fulfilled, (state, action) => {
			state.statusTool = 'Exitoso';
			state.tool = action.payload;
		})
		.addCase(createTool.rejected, (state, action) => {
			state.statusTool = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteTool.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteTool.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.tools = action.payload;
		})
		.addCase(deleteTool.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateTool.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateTool.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.tool = action.payload;
		})
		.addCase(updateTool.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getLocations.pending, (state) => {
			state.statusLocation = 'Cargando';
		})
		.addCase(getLocations.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.locations = action.payload;
		})
		.addCase(getLocations.rejected, (state, action) => {
			state.statusLocation = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createLocation.pending, (state) => {
			state.statusLocation = 'Cargando';
		})
		.addCase(createLocation.fulfilled, (state, action) => {
			state.statusLocation = 'Exitoso';
			state.Location = action.payload;
		})
		.addCase(createLocation.rejected, (state, action) => {
			state.statusTool = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteLocation.pending, (state) => {
			state.statusLocation = 'Cargando';
		})
		.addCase(deleteLocation.fulfilled, (state, action) => {
			state.statusLocation = 'Exitoso';
			state.Locations = action.payload;
		})
		.addCase(deleteLocation.rejected, (state, action) => {
			state.statusLocation = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateLocation.pending, (state) => {
			state.statusLocation = 'Cargando';
		})
		.addCase(updateLocation.fulfilled, (state, action) => {
			state.statusLocation = 'Exitoso';
			state.Location = action.payload;
		})
		.addCase(updateLocation.rejected, (state, action) => {
			state.statusLocation = 'Fallido';
			state.error = action.payload;
		});
};
