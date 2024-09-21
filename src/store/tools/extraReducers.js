import {
	getTool,
	getTools,
	createTool,
	deleteTool,
	updateTool,
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
};
