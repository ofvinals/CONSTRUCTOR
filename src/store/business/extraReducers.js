import {
	getBusiness,
	createBusiness,
	deleteBusiness,
	updateBusiness,
} from './thunks';

export const businessExtraReducers = (builder) => {
	builder
		.addCase(getBusiness.pending, (state) => {
			state.statusBusiness = 'Cargando';
		})
		.addCase(getBusiness.fulfilled, (state, action) => {
			state.statusBusiness = 'Exitoso';
			state.business = action.payload;
		})
		.addCase(getBusiness.rejected, (state, action) => {
			state.statusBusiness = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createBusiness.pending, (state) => {
			state.statusBusiness = 'Cargando';
		})
		.addCase(createBusiness.fulfilled, (state, action) => {
			state.statusBusiness = 'Exitoso';
			state.business = action.payload;
		})
		.addCase(createBusiness.rejected, (state, action) => {
			state.statusBusiness = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteBusiness.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteBusiness.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.business = action.payload;
		})
		.addCase(deleteBusiness.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateBusiness.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateBusiness.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.business = action.payload;
		})
		.addCase(updateBusiness.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
};
