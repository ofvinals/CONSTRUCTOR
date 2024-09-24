/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { db, storage } from '../../services/firebase';
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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { showToast } from '../toast/slice';

export const getTools = createAsyncThunk(
	'tool/getTools',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'tools')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de las herramientas',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getTool = createAsyncThunk(
	'tool/getTool',
	async ({ id }, { dispatch }) => {
		try {
			const toolRef = doc(db, 'tools', id);
			const snapshot = await getDoc(toolRef);
			const toolData = snapshot.data();
			// Obtener el historial de movimientos
			const historyRef = collection(db, 'tools', id, 'movementHistory');
			const historySnapshot = await getDocs(historyRef);
			const historyData = [];
			historySnapshot.forEach((doc) => {
				const movement = doc.data();
				historyData.push({
					uid: doc.id,
					...movement,
					date: movement.date.toDate().toISOString(), 
				});
			});

			return { ...toolData, movementHistory: historyData };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de la herramienta',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createTool = createAsyncThunk(
	'tool/createTool',
	async ({ values, fileImage }, { dispatch }) => {
		try {
			const toolsRef = collection(db, 'tools');
			let url = ''; // Variable para almacenar la URL
			if (fileImage) {
				// Crea una referencia única para la foto
				const fileName = `${fileImage.name}`; // Corrige aquí
				const storageRef = ref(storage, `tools/${fileName}`);
				// Subir la imagen al almacenamiento
				const uploadTask = uploadBytesResumable(storageRef, fileImage);
				// Espera a que se complete la carga
				await uploadTask;
				// Obtener la URL de descarga
				url = await getDownloadURL(uploadTask.snapshot.ref);
			}
			// Eliminar campos con valores undefined antes de actualizar
			const filteredValues = Object.fromEntries(
				Object.entries(values).filter(([_, value]) => value !== undefined)
			);
			const res = await addDoc(toolsRef, {
				...filteredValues,
				photoTool: url,
			});
			dispatch(getTools());
			dispatch(
				showToast({
					type: 'success',
					message: 'Herramienta creada exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear la herramienta',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateTool = createAsyncThunk(
	'tool/updateTool',
	async ({ id, values, fileImage }, { dispatch }) => {
		try {
			const toolRef = doc(db, 'tools', id);
			let url = '';
			if (fileImage) {
				const fileName = `${id}_${fileImage.name}`;
				const storageRef = ref(storage, `tools/${fileName}`);
				const uploadTask = uploadBytesResumable(storageRef, fileImage);
				await uploadTask;
				url = await getDownloadURL(uploadTask.snapshot.ref);
			}
			// Eliminar campos con valores undefined antes de actualizar
			const filteredValues = Object.fromEntries(
				Object.entries(values).filter(([_, value]) => value !== undefined)
			);
			await updateDoc(toolRef, { ...filteredValues, photoTool: url });
			const toolDoc = await getDoc(doc(db, 'tools', id));
			dispatch(getTools());
			dispatch(
				showToast({
					type: 'success',
					message: 'Herramienta actualizada exitosamente',
				})
			);
			return toolDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la herramienta',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const saveMovementHistory = createAsyncThunk(
	'tool/saveMovementHistory',
	async ({ toolId, fromLocation, toLocation, movedBy }) => {
		try {
			const historyRef = collection(db, 'tools', toolId, 'movementHistory');
			await addDoc(historyRef, {
				from: fromLocation,
				to: toLocation,
				movedBy: movedBy,
				date: new Date(),
			});
		} catch (error) {
			console.error('Error al guardar el historial de movimientos:', error);
		}
	}
);

export const deleteTool = createAsyncThunk(
	'tool/deleteTool',
	async ({ id }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'tools', id));
			dispatch(getTools());
			dispatch(
				showToast({
					type: 'success',
					message: 'Herramienta eliminada exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar la herramienta',
				})
			);
			throw error;
		}
	}
);

export const getLocations = createAsyncThunk(
	'tool/getLocations',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'location')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos de las ubicaciones',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createLocation = createAsyncThunk(
	'tool/createLocation',
	async ({ values }, { dispatch }) => {
		try {
			const locationsRef = collection(db, 'location');
			const res = await addDoc(locationsRef, values);
			dispatch(getLocations());
			dispatch(
				showToast({
					type: 'success',
					message: 'Ubicacion creada exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear la ubicacion',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateLocation = createAsyncThunk(
	'tool/updateLocation',
	async ({ id, values }, { dispatch }) => {
		console.log(id, values);
		try {
			const locationsRef = doc(db, 'location', id);
			await updateDoc(locationsRef, values);
			const toolDoc = await getDoc(locationsRef);
			dispatch(
				showToast({
					type: 'success',
					message: 'Ubicacion actualizada exitosamente',
				})
			);
			return toolDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la ubicacion',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteLocation = createAsyncThunk(
	'tool/deleteLocation',
	async ({ id }, { dispatch }) => {
		console.log(id);
		try {
			const locationsRef = doc(db, 'location', id);
			await deleteDoc(locationsRef, id);
			dispatch(getLocations());
			dispatch(
				showToast({
					type: 'success',
					message: 'Ubicacion eliminada exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar la ubicacion',
				})
			);
			throw error;
		}
	}
);
