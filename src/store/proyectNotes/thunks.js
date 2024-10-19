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

export const getNotes = createAsyncThunk(
	'note/getNotes',
	async ({ proyectId }, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(
				query(collection(db, 'proyects', proyectId, 'notes'))
			);
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener actas',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getNote = createAsyncThunk(
	'note/getNote',
	async ({ proyectId, noteId }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'proyects', proyectId, 'notes', noteId);
			const snapshot = await getDoc(usuarioRef);
			const noteData = snapshot.data();
			return noteData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el acta',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createNote = createAsyncThunk(
	'note/createNote',
	async ({ proyectId, values }, { dispatch }) => {
		console.log(proyectId, values);
		try {
			const notesRef = collection(db, 'proyects', proyectId, 'notes');
			const res = await addDoc(notesRef, values);
			dispatch(getNotes({ proyectId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Acta creada exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el acta',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateNote = createAsyncThunk(
	'note/updateNote',
	async ({ proyectId, noteId, values }, { dispatch }) => {
		try {
			const noteRef = doc(db, 'proyects', proyectId, 'notes', noteId);
			await updateDoc(noteRef, values);
			const noteDoc = await getDoc(doc(db, 'notes', noteId));
			dispatch(getNotes({ proyectId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Acta actualizada exitosamente',
				})
			);
			return noteDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el acta',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteNote = createAsyncThunk(
	'note/deleteNote',
	async ({ proyectId, noteId }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'proyects', proyectId, 'notes', noteId));
			dispatch(getNotes({ proyectId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Acta eliminada exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el acta',
				})
			);
			console.error('Error al eliminar el acta:', error);
			throw error;
		}
	}
);
