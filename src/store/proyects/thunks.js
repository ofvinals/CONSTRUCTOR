/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../../services/firebase';
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
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
	uploadBytes,
	deleteObject,
	listAll,
} from 'firebase/storage';

export const getProyects = createAsyncThunk(
	'proyect/getProyects',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'proyects')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener proyectos',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getProyect = createAsyncThunk(
	'proyect/getProyect',
	async ({ proyectId }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'proyects', proyectId);
			const snapshot = await getDoc(usuarioRef);
			const proyectData = snapshot.data();
			return proyectData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el proyecto',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createProyect = createAsyncThunk(
	'proyect/createProyect',
	async ({ values }, { dispatch }) => {
		try {
			const proyectData = {
				budgetId: values,
				isActive: true,
			};
			const proyectsRef = collection(db, 'proyects');
			const res = await addDoc(proyectsRef, proyectData);
			dispatch(getProyects());
			dispatch(
				showToast({
					type: 'success',
					message: 'Proyecto creado exitosamente.',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el proyecto',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateProyect = createAsyncThunk(
	'proyect/updateProyect',
	async ({ proyectId, values }, { dispatch }) => {
		try {
			const proyectRef = doc(db, 'proyects', proyectId);
			await updateDoc(proyectRef, values);
			const proyectDoc = await getDoc(doc(db, 'proyects', proyectId));
			dispatch(getProyects());
			dispatch(
				showToast({
					type: 'success',
					message: 'Proyecto actualizado exitosamente',
				})
			);
			return proyectDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el proyecto',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const disableProyect = createAsyncThunk(
	'proyect/disableProyect',
	async ({ proyectId }, { rejectWithValue, dispatch }) => {
		try {
			const proyectDoc = doc(db, 'proyects', proyectId);
			await updateDoc(proyectDoc, { isActive: false });
			const updatedProyect = await getDoc(proyectDoc);
			dispatch(getProyects());
			dispatch(
				showToast({
					type: 'success',
					message: 'Proyecto archivado exitosamente',
				})
			);
			return { uid: updatedProyect.uid, ...updatedProyect.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const enableProyect = createAsyncThunk(
	'proyect/enableProyect',
	async ({ proyectId }, { rejectWithValue, dispatch }) => {
		try {
			const proyectDoc = doc(db, 'proyects', proyectId);
			await updateDoc(proyectDoc, { isActive: true });
			const updatedProyect = await getDoc(proyectDoc);
			dispatch(getProyects());
			dispatch(
				showToast({
					type: 'success',
					message: 'Proyecto desarchivado exitosamente',
				})
			);
			return { uid: updatedProyect.id, ...updatedProyect.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const deleteProyect = createAsyncThunk(
	'proyect/deleteProyect',
	async ({ proyectId }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'proyects', proyectId));
			dispatch(getProyects());
			dispatch(
				showToast({
					type: 'success',
					message: 'Proyecto eliminado exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el proyecto',
				})
			);
			console.error('Error al eliminar el proyecto:', error);
			throw error;
		}
	}
);

export const getDocuments = createAsyncThunk(
	'proyect/getDocuments',
	async (_, { dispatch }) => {
		try {
			// Crear referencia al directorio de archivos
			const storageRef = ref(storage, 'proyects/docs/');
			// Listar todos los archivos del directorio
			const result = await listAll(storageRef);
			// Obtener las URLs de descarga para cada archivo
			const fileURLs = await Promise.all(
				result.items.map(async (itemRef) => {
					const downloadURL = await getDownloadURL(itemRef);
					return {
						name: itemRef.name,
						url: downloadURL,
					};
				})
			);
			return fileURLs;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al mostrar los archivos',
				})
			);
			console.error('Error al obtener archivos:', error);
			throw error;
		}
	}
);

export const createDocs = createAsyncThunk(
	'proyect/createDocs',
	async ({ file }, { dispatch }) => {
		try {
			// Crear una referencia al archivo
			const storageRef = ref(storage, `proyects/docs/${file.name}`);
			// Subir el archivo
			const snapshot = await uploadBytes(storageRef, file);
			// Obtener la URL del archivo subido
			const downloadURL = await getDownloadURL(snapshot.ref);
			dispatch(
				showToast({
					type: 'success',
					message: 'Archivo guardado exitosamente',
				})
			);
			// Retornar la URL para guardarla o utilizarla en tu app
			return downloadURL;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al subir el archivo',
				})
			);
			console.error('Error al subir archivo:', error);
		}
	}
);

export const deleteDocs = createAsyncThunk(
	'proyect/deleteDocs',
	async ({ file }, { dispatch }) => {
		try {
			// Crear una referencia al archivo
			const fileRef = ref(storage, `proyects/docs/${file}`);
			// Eliminar el archivo
			await deleteObject(fileRef);
			dispatch(
				showToast({
					type: 'success',
					message: 'Archivo eliminado exitosamente',
				})
			);
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el archivo',
				})
			);
			console.error('Error al eliminar archivo:', error);
		}
	}
);
