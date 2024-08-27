import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/slice';
import toastReducer from './toast/slice';
import authReducer from './auth/slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		users: userReducer,
		toast: toastReducer,
	},
});
