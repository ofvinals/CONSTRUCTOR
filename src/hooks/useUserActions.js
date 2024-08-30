import { useAppDispatch, useAppSelector } from './store';
import {
	getUser as getUserThunk,
	getUserbyGoogle as getUserbyGoogleThunk,
	getUsers as getUsersThunk,
	createUser as createUserThunk,
	deleteUser as deleteUserThunk,
	updateUser as updateUserThunk,
	enableUser as enableUserThunk,
	disableUser as disableUserThunk,
} from '../store/users/thunks';
import { clearUser } from '../store/users/slice';

export const useUserActions = () => {
	const users = useAppSelector((state) => state.users.users);
	const allUsersStatus = useAppSelector((state) => state.users.status);
	const user = useAppSelector((state) => state.users.user);
	const userStatusUpdate = useAppSelector((state) => state.users.statusUpdate);
	const userStatusDelete = useAppSelector((state) => state.users.statusDelete);
	const userStatus = useAppSelector((state) => state.users.statusUser);
	const dispatch = useAppDispatch();

	const getUser = async ({ id }) => {
		await dispatch(getUserThunk({ id }));
	};

	const getUsers = async () => {
		await dispatch(getUsersThunk());
	};

	const getUserbyGoogle = async () => {
		await dispatch(getUserbyGoogleThunk());
	};

	const createUser = async ({ values }) => {
		await dispatch(createUserThunk({ values }));
	};

	const updateUser = async ({ id, values }) => {
		await dispatch(updateUserThunk({ id, values }));
	};

	const deleteUser = async ({ id }) => {
		await dispatch(deleteUserThunk({ id }));
	};

	const disableUser = async ({ id }) => {
		await dispatch(disableUserThunk({ id }));
	};

	const enableUser = async ({ id }) => {
		await dispatch(enableUserThunk({ id }));
	};

	const clearStateUser = () => {
		dispatch(clearUser());
	};

	return {
		users,
		allUsersStatus,
		userStatusUpdate,
		user,
		getUser,
		getUserbyGoogle,
		getUsers,
		createUser,
		deleteUser,
		updateUser,
		clearStateUser,
		userStatusDelete,
		userStatus,
		disableUser,
		enableUser,
	};
};
