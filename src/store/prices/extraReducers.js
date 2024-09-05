import {
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	getSubcategories,
	createSubcategory,
	updateSubcategory,
	deleteSubcategory,
	createItem,
	updateItem,
	deleteItem,
} from './thunks';

export const priceExtraReducers = (builder) => {
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
			state.category = action.payload ;
		})
		.addCase(deleteCategory.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(getSubcategories.pending, (state) => {
			state.status = 'Cargando'; 
		})
		.addCase(getSubcategories.fulfilled, (state, action) => {
			console.log('Subcategories fetched:', action.payload);
			const { categoryId, subcategories } = action.payload;
			state.status = 'Exitoso';
			state.subcategories[categoryId] = subcategories;
		})
		.addCase(getSubcategories.rejected, (state, action) => {
			state.state = 'Fallido'; 
			state.error = action.error.message;
		});

	builder
		.addCase(createSubcategory.pending, (state) => {
			state.statusSubcategory = 'Cargando';
		})
		.addCase(createSubcategory.fulfilled, (state, action) => {
			state.statusSubcategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(createSubcategory.rejected, (state, action) => {
			state.statusSubcategory = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(updateSubcategory.pending, (state) => {
			state.statusSubcategory = 'Cargando';
		})
		.addCase(updateSubcategory.fulfilled, (state, action) => {
			state.statusSubcategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(updateSubcategory.rejected, (state, action) => {
			state.statusSubcategory = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(deleteSubcategory.pending, (state) => {
			state.statusSubcategory = 'Cargando';
		})
		.addCase(deleteSubcategory.fulfilled, (state, action) => {
			state.statusSubcategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(deleteSubcategory.rejected, (state, action) => {
			state.statusSubcategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createItem.pending, (state) => {
			state.statusCategory = 'Cargando';
		})
		.addCase(createItem.fulfilled, (state, action) => {
			state.statusCategory = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(createItem.rejected, (state, action) => {
			state.statusCategory = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateItem.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateItem.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.category = action.payload;
		})
		.addCase(updateItem.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteItem.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteItem.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.categories = action.payload;
		})
		.addCase(deleteItem.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
};
