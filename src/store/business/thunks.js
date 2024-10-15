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
} from 'firebase/storage';

export const getBusiness = createAsyncThunk(
	'business/getBusiness',
	async (_, { dispatch }) => {
		const businessesArray = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'business')));
			querySnapshot.forEach((doc) => {
				businessesArray.push({ uid: doc.id, ...doc.data() });
			});
			const firstBusiness = businessesArray[0];
			return firstBusiness;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener la info de la empresa',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createBusiness = createAsyncThunk(
	'business/createBusiness',
	async ({ values, fileImage }, { dispatch }) => {
		try {
			let logoBusinessUrl = values?.logoBusiness || '';
			if (fileImage) {
				const storageRef = ref(
					storage,
					`business/${Date.now()}_${fileImage.name}`
				);
				const uploadResult = await uploadBytes(storageRef, fileImage);
				logoBusinessUrl = await getDownloadURL(uploadResult.ref);
			}
			const businessData = {
				...values,
				logoBusiness: logoBusinessUrl,
			};
			const businessRef = collection(db, 'business');
			const res = await addDoc(businessRef, businessData);
			dispatch(getBusiness());
			dispatch(
				showToast({
					type: 'success',
					message: 'Empresa creada exitosamente.',
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

export const updateBusiness = createAsyncThunk(
	'business/updateBusiness',
	async ({ id, values, fileImage }, { dispatch }) => {
		console.log(fileImage);
		try {
			let logoBusinessUrl = values?.logoBusiness || '';
			if (fileImage) {
				const storageRef = ref(storage, `business/${id}/${fileImage.name}`);
				const uploadResult = await uploadBytes(storageRef, fileImage);
				logoBusinessUrl = await getDownloadURL(uploadResult.ref);
			}
			const businessRef = doc(db, 'business', id);
			await updateDoc(businessRef, {
				...values,
				logoBusiness: logoBusinessUrl,
			});
			const businessDoc = await getDoc(doc(db, 'business', id));
			dispatch(getBusiness());
			dispatch(
				showToast({
					type: 'success',
					message: 'Info de empresa actualizada exitosamente',
				})
			);
			return businessDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la info de la empresa',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteBusiness = createAsyncThunk(
	'business/deleteBusiness',
	async ({ id }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'businesss', id));
			dispatch(getBusiness());
			dispatch(
				showToast({
					type: 'success',
					message: 'Info de la empresa eliminada exitosamente',
				})
			);
			return;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar la info',
				})
			);
			console.error('Error al eliminar la info:', error);
			throw error;
		}
	}
);
