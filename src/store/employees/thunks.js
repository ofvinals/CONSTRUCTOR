import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../services/firebase';
import {
	doc,
	addDoc,
	getDoc,
	getDocs,
	query,
	collection,
	updateDoc,
	deleteDoc,
} from 'firebase/firestore';
import { showToast } from '../toast/slice';

export const getEmployees = createAsyncThunk(
	'employee/getEmployees',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(
				query(collection(db, 'employees'))
			);
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de los empleados',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getEmployee = createAsyncThunk(
	'employee/getEmployee',
	async ({ id }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'employees', id);
			const snapshot = await getDoc(usuarioRef);
			const employeeData = snapshot.data();
			return employeeData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos del empleado',
				})
			);
			console.log(error);
			throw error;
		}
	}
);

export const createEmployee = createAsyncThunk(
	'employee/createEmployee',
	async ({ values }, { dispatch }) => {
		console.log(values);
		try {
			const displayNameValue = `${values.nombre} ${values.apellido}`;
			const employeesRef = collection(db, 'employees');
			const employeeData = {
				...values,
				admin: false,
				isActive: true,
				displayName: displayNameValue,
			};
			const res = await addDoc(employeesRef, employeeData);
			dispatch(getEmployees());

			dispatch(
				showToast({
					type: 'success',
					message: 'Empleado creado exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			// Manejo de errores
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el empleado',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateEmployee = createAsyncThunk(
	'employee/updateEmployee',
	async ({ id, values }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'employees', id);
			await updateDoc(usuarioRef, values);
			const employeeDoc = await getDoc(
				doc(db, 'employees', auth.currentEmployee.uid)
			);
			dispatch(getEmployees());
			dispatch(
				showToast({
					type: 'success',
					message: 'Empleado actualizado exitosamente',
				})
			);
			return employeeDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el empleado',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const disableEmployee = createAsyncThunk(
	'employee/disableEmployee',
	async ({ id }, { rejectWithValue, dispatch }) => {
		try {
			const employeeDoc = doc(db, 'employees', id);
			await updateDoc(employeeDoc, { isActive: false });
			const updatedEmployee = await getDoc(employeeDoc);
			dispatch(getEmployees());
			dispatch(
				showToast({
					type: 'success',
					message: 'Empleado inhabilitado exitosamente',
				})
			);
			if (updatedEmployee.exists()) {
				return { uid: updatedEmployee.uid, ...updatedEmployee.data() };
			} else {
				return null;
			}
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al inhabilitar el empleado',
				})
			);
			return rejectWithValue(error.message);
		}
	}
);

export const enableEmployee = createAsyncThunk(
	'employee/enableEmployee',
	async ({ id }, { rejectWithValue, dispatch }) => {
		try {
			const employeeDoc = doc(db, 'employees', id);
			await updateDoc(employeeDoc, { isActive: true });
			const updatedCategory = await getDoc(employeeDoc);
			dispatch(getEmployees());
			dispatch(
				showToast({
					type: 'success',
					message: 'Empleado habilitado exitosamente',
				})
			);
			if (updatedCategory.exists()) {
				return { uid: updatedCategory.id, ...updatedCategory.data() };
			} else {
				return null;
			}
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al habilitar el empleado',
				})
			);
			return rejectWithValue(error.message);
		}
	}
);

export const deleteEmployee = createAsyncThunk(
	'employee/deleteEmployee',
	async ({ id }, { dispatch }) => {
		console.log(id);
		try {
			await deleteDoc(doc(db, 'employees', id));
			dispatch(getEmployees());
			dispatch(
				showToast({
					type: 'success',
					message: 'Empleado eliminado exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el empleado',
				})
			);
			console.error('Error al eliminar el empleado:', error);
			throw error;
		}
	}
);

export const getConfig = createAsyncThunk(
	'employee/getConfig',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'config')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de los valores',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const updateConfig = createAsyncThunk(
	'employee/updateConfig',
	async ({ values }, { dispatch }) => {
		try {
			const configRef = doc(db, 'config');
			await updateDoc(configRef, values);
			const configDoc = await getDoc(
				doc(db, 'config', auth.currentConfig.uid)
			);
			dispatch(getEmployees());
			dispatch(
				showToast({
					type: 'success',
					message: 'Valores actualizados exitosamente',
				})
			);
			return configDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar los valores',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);
