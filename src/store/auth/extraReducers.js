import {
	login,
	loginWithGoogle,
	logout,
	register,
	verifyLoggedUser,
} from './thunks';

export const authExtraReducers = (builder) => {
	builder
		.addCase(loginWithGoogle.pending, (state) => {
			state.statusAuth = 'Cargando';
		})
		.addCase(loginWithGoogle.fulfilled, (state, action) => {
			state.statusAuth = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(loginWithGoogle.rejected, (state, action) => {
			state.statusAuth = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(login.pending, (state) => {
			state.statusAuth = 'Cargando';
		})
		.addCase(login.fulfilled, (state, action) => {
			state.statusAuth = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(login.rejected, (state, action) => {
			state.statusAuth = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(register.pending, (state) => {
			state.statusSign = 'Cargando';
		})
		.addCase(register.fulfilled, (state, action) => {
			state.statusSign = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(register.rejected, (state, action) => {
			state.statusSign = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(verifyLoggedUser.pending, (state) => {
			state.statusAuth = 'Cargando';
		})
		.addCase(verifyLoggedUser.fulfilled, (state, action) => {
			state.statusAuth = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(verifyLoggedUser.rejected, (state, action) => {
			state.statusAuth = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(logout.pending, (state) => {
			state.statusSign = 'Cargando';
		})
		.addCase(logout.fulfilled, (state) => {
			state.statusSign = 'Exitoso';
			state.loggedUser = null;
		})
		.addCase(logout.rejected, (state, action) => {
			state.statusSign = 'Fallido';
			state.error = action.payload;
		});
};
