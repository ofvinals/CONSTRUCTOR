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
	where,
} from 'firebase/firestore';
import { showToast } from '../toast/slice';

export const getAttendances = createAsyncThunk(
	'attendance/getAttendances',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(
				query(collection(db, 'attendances'))
			);
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de la asistencia',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getAttendance = createAsyncThunk(
	'attendance/getAttendance',
	async ({ id }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'attendances', id);
			const snapshot = await getDoc(usuarioRef);
			const attendanceData = snapshot.data();
			return attendanceData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de la asistencia',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createAttendance = createAsyncThunk(
	'attendance/createAttendance',
	async ({ values }, { dispatch }) => {
		try {
			const attendancesRef = collection(db, 'attendances');
			const attendanceData = {
				...values,
			};
			const res = await addDoc(attendancesRef, attendanceData);
			dispatch(getAttendances());

			dispatch(
				showToast({
					type: 'success',
					message: 'Asistencia registrada exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al registrar la asistencia',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateAttendance = createAsyncThunk(
	'attendance/updateEmployeeInAttendance',
	async ({ id, values }, { dispatch }) => {
		try {
			// Buscar el documento de asistencia por su ID
			const attendanceDocRef = doc(db, 'attendances', id);
			const attendanceDocSnapshot = await getDoc(attendanceDocRef);
			if (!attendanceDocSnapshot.exists()) {
				throw new Error('No se encontró el documento de asistencia.');
			}
			const attendanceData = attendanceDocSnapshot.data();
			const employeeIndex = attendanceData.employees.findIndex(
				(employee) => employee.uid === values.employeeId 
			);
			if (employeeIndex === -1) {
				throw new Error(
					'No se encontró el empleado dentro del documento de asistencia.'
				);
			}
			const updatedEmployees = attendanceData.employees.map((employee) =>
				employee.uid === values.employeeId
					? { ...employee, ...values }
					: employee
			);
			await updateDoc(attendanceDocRef, {
				employees: updatedEmployees,
			});
			console.log('Documento actualizado:', id);
			console.log('Empleados actualizados:', updatedEmployees);
			dispatch(getAttendances()); 
			dispatch(
				showToast({
					type: 'success',
					message: 'Asistencia actualizada exitosamente',
				})
			);
			return { id, updatedEmployees };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la asistencia',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const checkDateAvailability = createAsyncThunk(
	'attendance/checkDateAvailability',
	async ({ date }, { dispatch, rejectWithValue }) => {
		try {
			const formattedDate = new Date(date).toISOString().split('T')[0];
			const attendancesRef = collection(db, 'attendances');
			const q = query(attendancesRef, where('date', '==', formattedDate));
			const querySnapshot = await getDocs(q);
			const exists = !querySnapshot.empty;
			return exists;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al verificar la disponibilidad de la fecha',
				})
			);
			console.error(error);
			return rejectWithValue(
				'Error al verificar la disponibilidad de la fecha'
			);
		}
	}
);

export const getConfig = createAsyncThunk(
	'attendance/getConfig',
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
	'attendance/updateConfig',
	async ({ values }, { dispatch }) => {
		try {
			const configRef = doc(db, 'config');
			await updateDoc(configRef, values);
			const configDoc = await getDoc(
				doc(db, 'config', auth.currentConfig.uid)
			);
			dispatch(getAttendances());
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
