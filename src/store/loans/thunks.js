/* eslint-disable no-unused-vars */
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
			const loanData = values;
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

// Función para limpiar campos vacíos
const cleanObject = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => value !== undefined)
	);
};

export const updateLoan = createAsyncThunk(
	'loan/updateLoan',
	async ({ id, values }, { dispatch }) => {
		console.log(id, values);
		try {
			const cleanedValues = cleanObject(values);
			const loansRef = doc(db, 'loans', id);
			await updateDoc(loansRef, cleanedValues);
			const loanDoc = await getDoc(doc(db, 'loans', id));
			dispatch(getLoans());
			dispatch(
				showToast({
					type: 'success',
					message: 'Adelanto/Prestamo actualizado exitosamente',
				})
			);
			return loanDoc.data();
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
