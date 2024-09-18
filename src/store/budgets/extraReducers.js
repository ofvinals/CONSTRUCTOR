import {
	getConfigValues,
	getBudget,
	getBudgets,
	createBudget,
	duplicateBudget,
	deleteBudget,
	updateBudget,
	enableBudget,
	disableBudget,
} from './thunks';

export const budgetExtraReducers = (builder) => {
	builder
		.addCase(getConfigValues.pending, (state) => {
			state.statusValues = 'Cargando';
		})
		.addCase(getConfigValues.fulfilled, (state, action) => {
			state.statusValues = 'Exitoso';
			state.configValues = action.payload;
		})
		.addCase(getConfigValues.rejected, (state, action) => {
			state.statusValues = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getBudgets.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getBudgets.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.budgets = action.payload;
		})
		.addCase(getBudgets.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getBudget.pending, (state) => {
			state.statusBudget = 'Cargando';
		})
		.addCase(getBudget.fulfilled, (state, action) => {
			state.statusBudget = 'Exitoso';
			state.budget = action.payload;
		})
		.addCase(getBudget.rejected, (state, action) => {
			state.statusBudget = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createBudget.pending, (state) => {
			state.statusBudget = 'Cargando';
		})
		.addCase(createBudget.fulfilled, (state, action) => {
			state.statusBudget = 'Exitoso';
			state.budget = action.payload;
		})
		.addCase(createBudget.rejected, (state, action) => {
			state.statusBudget = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(duplicateBudget.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(duplicateBudget.fulfilled, (state, action) => {
			console.log(action);
			state.statusUpdate = 'Exitoso';
			state.budget = action.payload;
		})
		.addCase(duplicateBudget.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteBudget.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteBudget.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.budgets = action.payload;
		})
		.addCase(deleteBudget.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateBudget.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateBudget.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.budget = action.payload;
		})
		.addCase(updateBudget.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(enableBudget.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(enableBudget.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.budgets = state.budgets.map((budget) =>
				budget.uid === action.payload.uid ? action.payload : budget
			);
		})
		.addCase(enableBudget.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(disableBudget.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(disableBudget.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.budgets = state.budgets.map((budget) =>
				budget.uid === action.payload.uid ? action.payload : budget
			);
		})
		.addCase(disableBudget.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
};
