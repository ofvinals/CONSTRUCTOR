import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../services/firebase';
import {
	doc,
	addDoc,
	getDoc,
	getDocs,
	query,
	collection,
	updateDoc,
} from 'firebase/firestore';
import { showToast } from '../toast/slice';

export const getLoans = createAsyncThunk(
	'loan/getLoans',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'loans')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos del prestamo',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getLoan = createAsyncThunk(
	'loan/getLoan',
	async ({ id }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'loans', id);
			const snapshot = await getDoc(usuarioRef);
			const loanData = snapshot.data();
			return loanData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos del prestamo',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createLoan = createAsyncThunk(
	'loan/createLoan',
	async ({ values }, { dispatch }) => {
		try {
			const loansRef = collection(db, 'loans');
			const loanData = {
				values,
			};
			const res = await addDoc(loansRef, loanData);
			dispatch(getLoans());

			dispatch(
				showToast({
					type: 'success',
					message: 'Adelanto/Prestamo registrado exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al registrar el prestamo',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateLoan = createAsyncThunk(
	'loan/updateEmployeeInLoan',
	async ({ id, values }, { dispatch }) => {
		try {
			const loansRef = collection(db, 'loans');
			const querySnapshot = await getDocs(loansRef);
			let loanId;
			let updatedEmployees;
			for (const docSnapshot of querySnapshot.docs) {
				const loanData = docSnapshot.data();
				// Verificar si el array de employees contiene el uid del employee
				const employeeIndex = loanData.employees.findIndex(
					(employee) => employee.uid === id
				);
				if (employeeIndex !== -1) {
					// Encontrar el ID del documento de loan
					loanId = docSnapshot.id;
					// Actualizar el array de employees
					updatedEmployees = loanData.employees.map((employee, index) =>
						index === employeeIndex
							? { ...employee, ...values }
							: employee
					);
					// Actualizar el documento en Firestore
					await updateDoc(docSnapshot.ref, {
						employees: updatedEmployees,
					});
					// Salir del bucle una vez que encontramos y actualizamos el documento
					break;
				}
			}
			dispatch(
				showToast({
					type: 'success',
					message: 'Adelanto/Prestamo actualizado exitosamente',
				})
			);
			return { loanId, updatedEmployees };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el prestamo',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);
