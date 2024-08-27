import { useAppDispatch, useAppSelector } from './store';
import {
	getEmployee as getEmployeeThunk,
	getEmployees as getEmployeesThunk,
	createEmployee as createEmployeeThunk,
	deleteEmployee as deleteEmployeeThunk,
	updateEmployee as updateEmployeeThunk,
	enableEmployee as enableEmployeeThunk,
	disableEmployee as disableEmployeeThunk,
	getConfig as getConfigThunk,
	updateConfig as updateConfigThunk,
} from '../store/employees/thunks';
import { clearEmployee } from '../store/employees/slice';

export function useEmployeeActions() {
	const employees = useAppSelector((state) => state.employees.employees);
	const allEmployeesStatus = useAppSelector((state) => state.employees.status);
	const employee = useAppSelector((state) => state.employees.employee);
	const employeeStatusUpdate = useAppSelector(
		(state) => state.employees.statusUpdate
	);
	const employeeStatusDelete = useAppSelector(
		(state) => state.employees.statusDelete
	);
	const employeeStatus = useAppSelector(
		(state) => state.employees.statusEmployee
	);
	const dispatch = useAppDispatch();

	const getEmployee = async ({ id }) => {
		await dispatch(getEmployeeThunk({ id }));
	};

	const getEmployees = async () => {
		await dispatch(getEmployeesThunk());
	};

	const createEmployee = async ({ values }) => {
		console.log(values);
		await dispatch(createEmployeeThunk({ values }));
	};

	const updateEmployee = async ({ id, values }) => {
		await dispatch(updateEmployeeThunk({ id, values }));
	};

	const deleteEmployee = async ({ id }) => {
		console.log(id);
		await dispatch(deleteEmployeeThunk({ id }));
	};

	const disableEmployee = async ({ id }) => {
		await dispatch(disableEmployeeThunk({ id }));
	};

	const enableEmployee = async ({ id }) => {
		await dispatch(enableEmployeeThunk({ id }));
	};

	const clearStateEmployee = () => {
		dispatch(clearEmployee());
	};

	const getConfig = async () => {
		await dispatch(getConfigThunk());
	};

	const updateConfig = async ({ id, values }) => {
		await dispatch(updateConfigThunk({ id, values }));
	};

	return {
		employees,
		allEmployeesStatus,
		employeeStatusUpdate,
		employee,
		getEmployee,
		getEmployees,
		createEmployee,
		deleteEmployee,
		updateEmployee,
		clearStateEmployee,
		employeeStatusDelete,
		employeeStatus,
		disableEmployee,
		enableEmployee,
		updateConfig,
		getConfig,
	};
}
