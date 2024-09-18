import {
	exportSelectedItems,
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	getItemPrice,
	getItemsPrice,
	createItemPrice,
	updateItemPrice,
	deleteItemPrice,
} from './thunks';

export const priceExtraReducers = (builder) => {
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
		.addCase(getCategories.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getCategories.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.categories = action.payload;
		})
		.addCase(getCategories.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getCategory.pending, (state) => {
			state.statusCategory = 'Cargando';
		})
		.addCase(getCategory.fulfilled, (state, action) => {
			state.statusCategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(getCategory.rejected, (state, action) => {
			state.statusCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createCategory.pending, (state) => {
			state.statusCategory = 'Cargando';
		})
		.addCase(createCategory.fulfilled, (state, action) => {
			state.statusCategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(createCategory.rejected, (state, action) => {
			state.statusCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateCategory.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateCategory.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(updateCategory.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteCategory.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteCategory.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(deleteCategory.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getItemsPrice.pending, (state) => {
			state.statusPriceCategory = 'Cargando';
		})
		.addCase(getItemsPrice.fulfilled, (state, action) => {
			state.statusPriceCategory = 'Exitoso';
			state.ItemsPrice = action.payload;
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
			state.itemsPrice = action.payload;
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
			state.itemPrice = action.payload;
		})
		.addCase(deleteItemPrice.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
};
