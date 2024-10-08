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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { showToast } from '../toast/slice';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const getUsers = createAsyncThunk(
	'user/getUsers',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'users')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener clientes',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getUser = createAsyncThunk(
	'user/getUser',
	async ({ id }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'users', id);
			const snapshot = await getDoc(usuarioRef);
			const userData = snapshot.data();
			return userData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el cliente',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getUserbyGoogle = createAsyncThunk(
	'user/getUserbyGoogle',
	async ({ id }, { dispatch }) => {
		try {
			const querySnapshot = await getDoc(doc(db, 'users', id));
			return { uid: querySnapshot.id, ...querySnapshot.data() };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el usuario',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createUser = createAsyncThunk(
	'user/createUser',
	async ({ values }, { dispatch }) => {
		try {
			// Creación de usuario con email y contraseña
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password
			);
			const currentUser = userCredential.user;
			const displayNameValue = `${values.nombre} ${values.apellido}`;
			localStorage.setItem('accessToken', currentUser.accessToken);
			// Actualizar el displayName del usuario
			await updateProfile(currentUser, {
				displayName: displayNameValue,
			});
			// Agregar usuario a la colección "usuarios" en Firestore
			const usersRef = collection(db, 'users');
			const userData = {
				...values,
				admin: false,
				isActive: true,
				displayName: displayNameValue,
			};
			const res = await addDoc(usersRef, userData);
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Usuario creado exitosamente. Bienvenido!',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el cliente',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateUser = createAsyncThunk(
	'user/updateUser',
	async ({ id, values, fileImage }, { dispatch }) => {
		try {
			const { displayName } = values;
			const usuarioRef = doc(db, 'users', id);
			let url = auth.currentUser?.photoURL || '';
			if (fileImage) {
				// Subir la imagen al almacenamiento y obtener la URL
				const storageRef = ref(
					storage,
					`photoProfileUsers/${auth.currentUser.uid}`
				);
				const uploadTask = uploadBytesResumable(storageRef, fileImage);
				// Esperar a que se complete la carga
				await uploadTask;
				url = await getDownloadURL(uploadTask.ref);
			}
			// Eliminar campos con valores undefined antes de actualizar
			const filteredValues = Object.fromEntries(
				Object.entries(values).filter(([_, value]) => value !== undefined)
			);
			// Actualizar el documento en Firestore
			await updateDoc(usuarioRef, { ...filteredValues, photoProfile: url });
			// Actualizar el perfil del usuario autenticado
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, {
					displayName,
					photoProfile: url || '',
				});
			}
			const userDoc = await getDoc(doc(db, 'users', id));
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Perfil de usuario actualizado exitosamente',
				})
			);
			return userDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el perfil de usuario',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const disableUser = createAsyncThunk(
	'user/disableUser',
	async ({ id }, { rejectWithValue, dispatch }) => {
		try {
			const userDoc = doc(db, 'users', id);
			await updateDoc(userDoc, { isActive: false });
			const updatedUser = await getDoc(userDoc);
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Cliente inhabilitado exitosamente',
				})
			);
			return { uid: updatedUser.uid, ...updatedUser.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const enableUser = createAsyncThunk(
	'user/enableUser',
	async ({ id }, { rejectWithValue, dispatch }) => {
		try {
			const userDoc = doc(db, 'users', id);
			await updateDoc(userDoc, { isActive: true });
			const updatedCategory = await getDoc(userDoc);
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Cliente habilitado exitosamente',
				})
			);
			return { uid: updatedCategory.id, ...updatedCategory.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const deleteUser = createAsyncThunk(
	'user/deleteUser',
	async ({ id }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'users', id));
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Usuario eliminado exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el usuario',
				})
			);
			console.error('Error al eliminar el usuario:', error);
			throw error;
		}
	}
);
