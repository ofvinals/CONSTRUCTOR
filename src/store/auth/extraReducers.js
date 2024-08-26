import {
	loginWithEmail,
	loginWithGoogle,
	logout,
	registro,
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
		.addCase(loginWithEmail.pending, (state) => {
			state.statusAuth = 'Cargando';
		})
		.addCase(loginWithEmail.fulfilled, (state, action) => {
			state.statusAuth = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(loginWithEmail.rejected, (state, action) => {
			state.statusAuth = 'Fallido';
			state.error = action.payload;
		});

	builder
		.addCase(registro.pending, (state) => {
			state.statusSign = 'Cargando';
		})
		.addCase(registro.fulfilled, (state, action) => {
			state.statusSign = 'Exitoso';
			state.loggedUser = action.payload;
		})
		.addCase(registro.rejected, (state, action) => {
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
