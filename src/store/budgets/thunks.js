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

export const getConfigValues = createAsyncThunk(
	'budget/getConfigValues',
	async ({ budgetId }, { dispatch }) => {
		try {
			const budgetRef = doc(db, 'budgets', budgetId);
			const snapshot = await getDoc(budgetRef);
			if (snapshot.exists()) {
				const budgetData = snapshot.data();
				const configValues = budgetData?.fees || {};
				return configValues;
			} else {
				throw new Error('Documento no encontrado');
			}
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los valores',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const updateConfig = createAsyncThunk(
	'budget/updateConfig',
	async ({ budgetId, values }, { dispatch }) => {
		try {
			const budgetRef = doc(db, 'budgets', budgetId);
			const cleanedValues = {
				benefits: values.benefits ?? '',
				anteproyectFee: values.anteproyectFee ?? '',
				proyectFee: values.proyectFee ?? '',
				dtFee: values.dtFee ?? '',
				adminFee: values.adminFee ?? '',
				otherFee: values.otherFee ?? '',
			};
			const updatedFees = {};
			for (const [key, value] of Object.entries(cleanedValues)) {
				if (value !== '') {
					updatedFees[key] = value;
				}
			}
			await updateDoc(budgetRef, {
				fees: updatedFees,
			});
			const updatedBudgetDoc = await getDoc(budgetRef);
			dispatch(getConfigValues({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Valores actualizados exitosamente',
				})
			);
			return updatedBudgetDoc.data();
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

export const getBudgets = createAsyncThunk(
	'budget/getBudgets',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(query(collection(db, 'budgets')));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener presupuestos',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getBudget = createAsyncThunk(
	'budget/getBudget',
	async ({ budgetId }, { dispatch }) => {
		try {
			const usuarioRef = doc(db, 'budgets', budgetId);
			const snapshot = await getDoc(usuarioRef);
			const budgetData = snapshot.data();
			return budgetData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el presupuesto',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createBudget = createAsyncThunk(
	'budget/createBudget',
	async ({ values, fileImage }, { dispatch }) => {
		try {
			let photoProfileUrl = values?.photoProfile || '';
			if (fileImage) {
				const storageRef = ref(
					storage,
					`budgets/${Date.now()}_${fileImage.name}`
				);
				const uploadResult = await uploadBytes(storageRef, fileImage);
				photoProfileUrl = await getDownloadURL(uploadResult.ref);
			}
			const budgetData = {
				...values,
				photoProfile: photoProfileUrl,
				isActive: true,
			};
			const budgetsRef = collection(db, 'budgets');
			const res = await addDoc(budgetsRef, budgetData);
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto creado exitosamente.',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el presupuesto',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const duplicateBudget = createAsyncThunk(
	'budget/duplicateBudget',
	async ({ budgetId }, { dispatch }) => {
		try {
			// Paso 1: Obtener el documento existente
			const budgetRef = doc(db, 'budgets', budgetId);
			const budgetSnap = await getDoc(budgetRef);

			if (!budgetSnap.exists()) {
				throw new Error('Presupuesto no encontrado');
			}
			// Copiar los datos del presupuesto
			const budgetData = budgetSnap.data();
			const newBudgetData = {
				...budgetData,
				name: `${budgetData.name} (Copia)`, 
			};
			// Paso 2: Crear un nuevo presupuesto en Firestore
			const budgetsRef = collection(db, 'budgets');
			const newBudgetRef = await addDoc(budgetsRef, newBudgetData);
		// Paso 3: Obtener y duplicar las categorías
			const categoriesRef = collection(
				db,
				'budgets',
				budgetId,
				'categories'
			);
			const categoriesSnap = await getDocs(categoriesRef);
			for (const categoryDoc of categoriesSnap.docs) {
				const categoryData = categoryDoc.data();
				const newCategoryRef = await addDoc(
					collection(db, 'budgets', newBudgetRef.id, 'categories'),
					{
						...categoryData,
					}
				);
				// Paso 4: Obtener y duplicar los items dentro de la categoría
				const itemsRef = collection(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryDoc.id,
					'items'
				);
				const itemsSnap = await getDocs(itemsRef);
				for (const itemDoc of itemsSnap.docs) {
					const itemData = itemDoc.data();
					await addDoc(
						collection(
							db,
							'budgets',
							newBudgetRef.id,
							'categories',
							newCategoryRef.id,
							'items'
						),
						{
							...itemData,
						}
					);
				}
				// Paso 5: Obtener y duplicar las subcategorías
				const subcategoriesRef = collection(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryDoc.id,
					'subcategories'
				);
				const subcategoriesSnap = await getDocs(subcategoriesRef);
				for (const subDoc of subcategoriesSnap.docs) {
					const subcategoryData = subDoc.data();
					const newSubcategoryRef = await addDoc(
						collection(
							db,
							'budgets',
							newBudgetRef.id,
							'categories',
							newCategoryRef.id,
							'subcategories'
						),
						{
							...subcategoryData,
						}
					);
					// Paso 6: Obtener y duplicar los items dentro de la subcategoría
					const itemsInSubRef = collection(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryDoc.id,
						'subcategories',
						subDoc.id,
						'items'
					);
					const itemsInSubSnap = await getDocs(itemsInSubRef);
					for (const itemDoc of itemsInSubSnap.docs) {
						const itemData = itemDoc.data();
						await addDoc(
							collection(
								db,
								'budgets',
								newBudgetRef.id,
								'categories',
								newCategoryRef.id,
								'subcategories',
								newSubcategoryRef.id,
								'items'
							),
							{
								...itemData,
							}
						);
					}
				}
			}
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto duplicado exitosamente.',
				})
			);
			return { id: newBudgetRef.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al duplicar el presupuesto',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateBudget = createAsyncThunk(
	'budget/updateBudget',
	async ({ budgetId, values, fileImage }, { dispatch }) => {
		try {
			let photoProfileUrl = values?.photoProfile || '';
			if (fileImage) {
				const storageRef = ref(
					storage,
					`budgets/${budgetId}/${fileImage.name}`
				);
				const uploadResult = await uploadBytes(storageRef, fileImage);
				photoProfileUrl = await getDownloadURL(uploadResult.ref);
			}
			const budgetRef = doc(db, 'budgets', budgetId);
			await updateDoc(budgetRef, {
				...values,
				photoProfile: photoProfileUrl,
			});
			const budgetDoc = await getDoc(doc(db, 'budgets', budgetId));
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto actualizado exitosamente',
				})
			);
			return budgetDoc.data();
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el presupuesto',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const disableBudget = createAsyncThunk(
	'budget/disableBudget',
	async ({ budgetId }, { rejectWithValue, dispatch }) => {
		try {
			const budgetDoc = doc(db, 'budgets', budgetId);
			await updateDoc(budgetDoc, { isActive: false });
			const updatedBudget = await getDoc(budgetDoc);
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto archivado exitosamente',
				})
			);
			return { uid: updatedBudget.uid, ...updatedBudget.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const enableBudget = createAsyncThunk(
	'budget/enableBudget',
	async ({ budgetId }, { rejectWithValue, dispatch }) => {
		try {
			const budgetDoc = doc(db, 'budgets', budgetId);
			await updateDoc(budgetDoc, { isActive: true });
			const updatedBudget = await getDoc(budgetDoc);
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto desarchivado exitosamente',
				})
			);
			return { uid: updatedBudget.id, ...updatedBudget.data() };
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const deleteBudget = createAsyncThunk(
	'budget/deleteBudget',
	async ({ budgetId }, { dispatch }) => {
		try {
			await deleteDoc(doc(db, 'budgets', budgetId));
			dispatch(getBudgets());
			dispatch(
				showToast({
					type: 'success',
					message: 'Presupuesto eliminado exitosamente',
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
