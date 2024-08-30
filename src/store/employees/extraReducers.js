import {
	getEmployee,
	getEmployees,
	createEmployee,
	deleteEmployee,
	updateEmployee,
	enableEmployee,
	disableEmployee,
	getConfig
} from './thunks';

export const employeeExtraReducers = (builder) => {
	builder
		.addCase(getEmployees.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getEmployees.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.employees = action.payload;
		})
		.addCase(getEmployees.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(getEmployee.pending, (state) => {
			state.statusEmployee = 'Cargando';
		})
		.addCase(getEmployee.fulfilled, (state, action) => {
			state.statusEmployee = 'Exitoso';
			state.employee = action.payload;
		})
		.addCase(getEmployee.rejected, (state, action) => {
			state.statusEmployee = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(createEmployee.pending, (state) => {
			state.statusEmployee = 'Cargando';
		})
		.addCase(createEmployee.fulfilled, (state, action) => {
			state.statusEmployee = 'Exitoso';
			state.employee = action.payload;
		})
		.addCase(createEmployee.rejected, (state, action) => {
			state.statusEmployee = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(deleteEmployee.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteEmployee.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.employees = action.payload;
		})
		.addCase(deleteEmployee.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(updateEmployee.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateEmployee.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.employee = action.payload;
		})
		.addCase(updateEmployee.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(enableEmployee.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(enableEmployee.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.employees = state.employees.map((employee) =>
				employee.uid === action.payload.uid ? action.payload : employee
			);
		})
		.addCase(enableEmployee.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(disableEmployee.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(disableEmployee.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.employees = state.employees.map((employee) =>
				employee.uid === action.payload.uid ? action.payload : employee
			);
		})
		.addCase(disableEmployee.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});

		builder
		.addCase(getConfig.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getConfig.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.config = action.payload;
		})
		.addCase(getConfig.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
};
