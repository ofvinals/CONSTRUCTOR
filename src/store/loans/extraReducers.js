import {
	getLoan,
	getLoans,
	createLoan,
	updateLoan,
} from './thunks';

export const loanExtraReducers = (builder) => {
	builder
		.addCase(getLoans.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getLoans.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.loans = action.payload;
		})
		.addCase(getLoans.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(getLoan.pending, (state) => {
			state.statusLoan = 'Cargando';
		})
		.addCase(getLoan.fulfilled, (state, action) => {
			state.statusLoan = 'Exitoso';
			state.loan = action.payload;
		})
		.addCase(getLoan.rejected, (state, action) => {
			state.statusLoan = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(createLoan.pending, (state) => {
			state.statusLoan = 'Cargando';
		})
		.addCase(createLoan.fulfilled, (state, action) => {
			state.statusLoan = 'Exitoso';
			state.loan = action.payload;
		})
		.addCase(createLoan.rejected, (state, action) => {
			state.statusLoan = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(updateLoan.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateLoan.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.loan = action.payload;
		})
		.addCase(updateLoan.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});

};
