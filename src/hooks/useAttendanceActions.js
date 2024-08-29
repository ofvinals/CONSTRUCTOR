import { useAppDispatch, useAppSelector } from './store';
import {
	getAttendance as getAttendanceThunk,
	getAttendances as getAttendancesThunk,
	createAttendance as createAttendanceThunk,
	updateAttendance as updateAttendanceThunk,
	checkDateAvailability as checkDateAvailabilityThunk,
} from '../store/attendances/thunks';
import { clearAttendance } from '../store/attendances/slice';

export function useAttendanceActions() {
	const attendances = useAppSelector((state) => state.attendances.attendances);
	const allAttendancesStatus = useAppSelector(
		(state) => state.attendances.status
	);
	const attendance = useAppSelector((state) => state.attendances.attendance);
	const attendanceStatusUpdate = useAppSelector(
		(state) => state.attendances.statusUpdate
	);
	const attendanceStatus = useAppSelector(
		(state) => state.attendances.statusAttendance
	);
	const dateAvailable = useAppSelector(
		(state) => state.attendances.dateAvailable
	);
	const statusDateCheck = useAppSelector(
		(state) => state.attendances.statusDateCheck
	);
	const dispatch = useAppDispatch();

	const getAttendance = async ({ id }) => {
		await dispatch(getAttendanceThunk({ id }));
	};

	const getAttendances = async () => {
		await dispatch(getAttendancesThunk());
	};

	const createAttendance = async ({ values }) => {
		await dispatch(createAttendanceThunk({ values }));
	};

	const updateAttendance = async ({ id, values }) => {
		await dispatch(updateAttendanceThunk({ id, values }));
	};

	const checkDateAvailability = async ({date}) => {
		const resultAction = await dispatch(checkDateAvailabilityThunk({date}));
		return resultAction.payload
	};

	const clearStateAttendance = () => {
		dispatch(clearAttendance());
	};

	return {
		attendances,
		allAttendancesStatus,
		attendanceStatusUpdate,
		attendance,
		getAttendance,
		getAttendances,
		createAttendance,
		updateAttendance,
		clearStateAttendance,
		attendanceStatus,
		checkDateAvailability,
		dateAvailable,
		statusDateCheck,
	};
}
