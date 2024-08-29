/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch } from './store';
import { getUsers } from '../store/users/thunks';
import { verifyLoggedUser } from '../store/auth/thunks';
import { getEmployees } from '../store/employees/thunks';
import { getConfig } from '../store/employees/thunks';
import { getAttendances } from '../store/attendances/thunks';

export function useGetData() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(verifyLoggedUser());
		dispatch(getUsers());
		dispatch(getEmployees());
		dispatch(getConfig());
		dispatch(getAttendances());

	}, []);

	return {};
}
