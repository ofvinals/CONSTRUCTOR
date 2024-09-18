import {
	getUser,
	getUsers,
	createUser,
	deleteUser,
	getUserbyGoogle,
	updateUser,
	enableUser,
	disableUser,
} from './thunks';

export const userExtraReducers = (builder) => {
	builder
		.addCase(getUsers.pending, (state) => {
			state.status = 'Cargando';
		})
		.addCase(getUsers.fulfilled, (state, action) => {
			state.status = 'Exitoso';
			state.users = action.payload;
		})
		.addCase(getUsers.rejected, (state, action) => {
			state.status = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getUser.pending, (state) => {
			state.statusUser = 'Cargando';
		})
		.addCase(getUser.fulfilled, (state, action) => {
			state.statusUser = 'Exitoso';
			state.user = action.payload;
		})
		.addCase(getUser.rejected, (state, action) => {
			state.statusUser = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(createUser.pending, (state) => {
			state.statusUser = 'Cargando';
		})
		.addCase(createUser.fulfilled, (state, action) => {
			state.statusUser = 'Exitoso';
			state.user = action.payload;
		})
		.addCase(createUser.rejected, (state, action) => {
			state.statusUser = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(deleteUser.pending, (state) => {
			state.statusDelete = 'Cargando';
		})
		.addCase(deleteUser.fulfilled, (state, action) => {
			state.statusDelete = 'Exitoso';
			state.users = action.payload;
		})
		.addCase(deleteUser.rejected, (state, action) => {
			state.statusDelete = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(updateUser.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(updateUser.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.user = action.payload;
		})
		.addCase(updateUser.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(enableUser.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(enableUser.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.users = state.users.map((user) =>
				user.uid === action.payload.uid ? action.payload : user
			);
		})
		.addCase(enableUser.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(disableUser.pending, (state) => {
			state.statusUpdate = 'Cargando';
		})
		.addCase(disableUser.fulfilled, (state, action) => {
			state.statusUpdate = 'Exitoso';
			state.users = state.users.map((user) =>
				user.uid === action.payload.uid ? action.payload : user
			);
		})
		.addCase(disableUser.rejected, (state, action) => {
			state.statusUpdate = 'Fallido';
			state.error = action.payload;
		});
	builder
		.addCase(getUserbyGoogle.pending, (state) => {
			state.statusUser = 'Cargando';
		})
		.addCase(getUserbyGoogle.fulfilled, (state, action) => {
			state.statusUser = 'Exitoso';
			state.user = action.payload;
		})
		.addCase(getUserbyGoogle.rejected, (state, action) => {
			state.statusUser = 'Fallido';
			state.error = action.payload;
		});
};
