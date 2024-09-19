import {
	exportSelectedItems,
	getBudgets,
	getBudget,
	createBudget,
	updateBudget,
	deleteBudget,
	getItemPrice,
	getItemsPrice,
	createItemPrice,
	updateItemPrice,
	deleteItemPrice,
} from './thunks';

export const budgetDetailExtraReducers = (builder) => {
	builder
	.addCase(exportSelectedItems.pending, (state) => {
		state.status = 'Cargando';
	})
	.addCase(exportSelectedItems.fulfilled, (state, action) => {
		state.status = 'Exitoso';
		state.categories = action.payload;
	})
	.addCase(exportSelectedItems.rejected, (state, action) => {
		state.status = 'Fallido';
		state.error = action.payload;
	});
	builder
		.addCase(getBudgets.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getBudgets.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.categories = action.payload;
		})
		.addCase(getBudgets.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getBudget.pending, (state) => {
			state.statusCategory = 'Cargando';
		})
		.addCase(getBudget.fulfilled, (state, action) => {
			state.statusCategory = 'Exitoso';
			state.category = action.payload.category;
		})
		.addCase(getBudget.rejected, (state, action) => {
			state.statusCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createBudget.pending, (state) => {
			state.statusCategory = 'Cargando';
		})
		.addCase(createBudget.fulfilled, (state, action) => {
			state.category = action.payload;
		})
		.addCase(createBudget.rejected, (state, action) => {
			state.statusCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateBudget.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateBudget.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(updateBudget.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteBudget.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteBudget.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(deleteBudget.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(getItemsPrice.pending, (state) => {
			state.statusPriceCategory = 'Cargando';
		})
		.addCase(getItemsPrice.fulfilled, (state, action) => {
			state.statusPriceCategory = 'Exitoso';
			state.itemsPrice = action.payload;
		})
		.addCase(getItemsPrice.rejected, (state, action) => {
			state.statusPriceCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getItemPrice.pending, (state) => {
			state.statusPrice = 'Cargando';
		})
		.addCase(getItemPrice.fulfilled, (state, action) => {
			state.statusPrice = 'Exitoso';
			state.itemPrice = action.payload;
		})
		.addCase(getItemPrice.rejected, (state, action) => {
			state.statusPrice = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createItemPrice.pending, (state) => {
			state.statusPriceCategory = 'Cargando';
		})
		.addCase(createItemPrice.fulfilled, (state, action) => {
			state.statusPriceCategory = 'Exitoso';
			state.itemPrice = action.payload;
		})
		.addCase(createItemPrice.rejected, (state, action) => {
			state.statusPriceCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateItemPrice.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateItemPrice.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.itemPrice = action.payload;
		})
		.addCase(updateItemPrice.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteItemPrice.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteItemPrice.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.itemsPrice = action.payload;
		})
		.addCase(deleteItemPrice.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
};
