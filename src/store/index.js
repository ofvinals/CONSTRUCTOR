import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/slice';
import toastReducer from './toast/slice'
import modalReducer from './modals/slice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		toast: toastReducer,
		modal: modalReducer,

	},
});
