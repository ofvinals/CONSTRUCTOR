import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../services/firebase';
import {
	doc,
	addDoc,
	getDoc,
	getDocs,
	deleteDoc,
	collection,
	updateDoc,
} from 'firebase/firestore';
import { showToast } from '../toast/slice';

export const getBudgetCategories = createAsyncThunk(
	'budgets/getBudgetCategories',
	async ({ budgetId }, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(
				collection(db, 'budgets', budgetId, 'categories')
			);
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los rubros',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getBudgetCategory = createAsyncThunk(
	'budgets/getBudgetCategory',
	async ({ budgetId, id }, { dispatch }) => {
		try {
			const categoryRef = doc(db, 'budgets', budgetId, 'categories', id);
			const categorySnapshot = await getDoc(categoryRef);
			const categoryData = categorySnapshot.data();
			// Obtener subcategorías
			const subcategoriesSnapshot = await getDocs(
				collection(categoryRef, 'subcategories')
			);
			const subcategories = await Promise.all(
				subcategoriesSnapshot.docs.map(async (doc) => {
					const subcategoryData = doc.data();
					// Obtener items
					const itemsSnapshot = await getDocs(
						collection(doc.ref, 'items')
					);
					const items = itemsSnapshot.docs.map((itemDoc) => ({
						uid: itemDoc.id,
						...itemDoc.data(),
					}));
					return {
						uid: doc.id,
						...subcategoryData,
						items,
					};
				})
			);
			return { ...categoryData, subcategories };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el rubro',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createBudgetCategory = createAsyncThunk(
	'budgets/createBudgetCategory',
	async ({ budgetId, values }, { dispatch }) => {
		try {
			const categoriesRef = collection(
				db,
				'budgets',
				budgetId,
				'categories'
			);
			const categoryData = { ...values };
			const res = await addDoc(categoriesRef, categoryData);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Rubro creado exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el rubro',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateBudgetCategory = createAsyncThunk(
	'budgets/updateBudgetCategory',
	async ({ budgetId, categoryId, values }, { dispatch }) => {
		try {
			const categoryRef = doc(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId
			);
			await updateDoc(categoryRef, values);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Rubro actualizado exitosamente',
				})
			);
			return { id: categoryId, updatedData: values };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el rubro',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteBudgetCategory = createAsyncThunk(
	'budgets/deleteBudgetCategory',
	async ({ budgetId, id }, { dispatch }) => {
		try {
			const categoryRef = doc(db, 'budgets', budgetId, 'categories', id);
			// Eliminar subcategorías e items
			const subcategoriesSnapshot = await getDocs(
				collection(categoryRef, 'subcategories')
			);
			await Promise.all(
				subcategoriesSnapshot.docs.map(async (subcatDoc) => {
					// Eliminar items
					const itemsSnapshot = await getDocs(
						collection(subcatDoc.ref, 'items')
					);
					await Promise.all(
						itemsSnapshot.docs.map((itemDoc) => deleteDoc(itemDoc.ref))
					);
					return deleteDoc(subcatDoc.ref);
				})
			);
			await deleteDoc(categoryRef);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Rubro eliminado exitosamente',
				})
			);
			return { id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el rubro',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const getBudgetSubcategories = createAsyncThunk(
	'budgets/getBudgetSubcategories',
	async ({ budgetId, id }, { dispatch }) => {
		// const { subcategories } = getState().prices;
		// if (subcategories[id]) {
		// 	// Si las subcategorías ya están en el estado, no hacer nada
		// 	return { categoryId: id, subcategories: subcategories[id] };
		// }
		try {
			const categoryRef = doc(db, 'budgets', budgetId, 'categories', id);
			const subcategoriesSnapshot = await getDocs(
				collection(categoryRef, 'subcategories')
			);
			const subcategoriesData = await Promise.all(
				subcategoriesSnapshot.docs.map(async (doc) => {
					const subcategoryData = doc.data();
					const itemsSnapshot = await getDocs(
						collection(doc.ref, 'items')
					);
					const items = itemsSnapshot.docs.map((itemDoc) => ({
						uid: itemDoc.id,
						...itemDoc.data(),
					}));
					return {
						uid: doc.id,
						...subcategoryData,
						items,
					};
				})
			);
			return { categoryId: id, subcategories: subcategoriesData };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los subrubros',
				})
			);
			console.error('Error fetching subcategories:', error);
			throw error;
		}
	}
);

export const createBudgetSubcategory = createAsyncThunk(
	'budgets/createSubcategory',
	async ({ budgetId, categoryId, values }, { dispatch }) => {
		try {
			const subcategoriesRef = collection(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'subcategories'
			);
			const subcategoryData = { ...values };
			const res = await addDoc(subcategoriesRef, subcategoryData);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(getBudgetSubcategories({ budgetId, id: categoryId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Subrubro creado exitosamente',
				})
			);
			return { id: res.id, categoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el subrubro',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateBudgetSubcategory = createAsyncThunk(
	'budgets/updateBudgetSubcategory',
	async ({ budgetId, categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const subcategoryRef = doc(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId
			);
			await updateDoc(subcategoryRef, values);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Subrubro actualizado exitosamente',
				})
			);
			return { subcategoryId, updatedData: values };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar el subrubro',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteBudgetSubcategory = createAsyncThunk(
	'budgets/deleteBudgetSubcategory',
	async ({ budgetId, categoryId, subcategoryId }, { dispatch }) => {
		try {
			const subcategoryRef = doc(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId
			);
			// Eliminar items dentro de la subcategoría
			const itemsSnapshot = await getDocs(
				collection(subcategoryRef, 'items')
			);
			await Promise.all(
				itemsSnapshot.docs.map((itemDoc) => deleteDoc(itemDoc.ref))
			);
			dispatch(getBudgetCategories({ budgetId }));
			dispatch(getBudgetSubcategories({ budgetId, id: categoryId }));
			await deleteDoc(subcategoryRef);
			dispatch(
				showToast({
					type: 'success',
					message: 'Subrubro eliminado exitosamente',
				})
			);
			return { subcategoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar el subrubro',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

// Obtener precios de ítems de una categoría
export const getBudgetCategoryItemsPrice = createAsyncThunk(
	'budgets/getBudgetCategoryItemsPrice',
	async ({ budgetId, categoryId }, { dispatch }) => {
		try {
			const itemsRef = collection(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'items'
			);
			const itemsSnapshot = await getDocs(itemsRef);
			const items = itemsSnapshot.docs.map((doc) => ({
				uid: doc.id,
				...doc.data(),
			}));
			return { categoryId, items };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los precios del rubro',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Obtener precios de ítems de una subcategoría
export const getBudgetSubcategoryItemsPrice = createAsyncThunk(
	'budgets/getBudgetSubcategoryItemsPrice',
	async ({ budgetId, categoryId, subcategoryId }, { dispatch }) => {
		try {
			const itemsRef = collection(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId,
				'items'
			);
			const itemsSnapshot = await getDocs(itemsRef);
			const items = itemsSnapshot.docs.map((doc) => ({
				uid: doc.id,
				...doc.data(),
			}));
			return { categoryId, subcategoryId, items };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los precios del rubro',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Obtener detalles de un ítem específico
export const getBudgetItemPrice = createAsyncThunk(
	'budgets/getBudgetItemPrice',
	async (
		{ budgetId, categoryId, subcategoryId, itemId, type },
		{ dispatch }
	) => {
		try {
			let itemRef;
			// Determina la referencia del documento según el nivel
			if (type === 'subcategory') {
				// Buscar en una subcategoría
				itemRef = doc(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryId,
					'subcategories',
					subcategoryId,
					'items',
					itemId
				);
			} else if (type === 'category') {
				// Buscar en una categoría directamente
				itemRef = doc(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryId,
					'items',
					itemId
				);
			} else {
				throw new Error('Nivel de búsqueda inválido');
			}
			const itemSnapshot = await getDoc(itemRef);
			if (itemSnapshot.exists()) {
				return {
					...itemSnapshot.data(),
					uid: itemSnapshot.id,
					categoryId,
					subcategoryId,
				};
			} else {
				throw new Error('Ítem no encontrado');
			}
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener el precio del ítem',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Crear un ítem de precio en una categoría
export const createBudgetCategoryItemPrice = createAsyncThunk(
	'budgets/createBudgetCategoryItemPrice',
	async ({ budgetId, categoryId, values }, { dispatch }) => {
		try {
			const itemsRef = collection(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'items'
			);
			const res = await addDoc(itemsRef, values);
			dispatch(getBudgetCategoryItemsPrice({ budgetId, categoryId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente en el rubro',
				})
			);
			return { id: res.id, categoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el ítem en el rubro',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Crear un ítem de precio en una subcategoría
export const createBudgetSubcategoryItemPrice = createAsyncThunk(
	'budgets/createBudgetSubcategoryItemPrice',
	async ({ budgetId, categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemsRef = collection(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId,
				'items'
			);
			const res = await addDoc(itemsRef, values);
			dispatch(
				getBudgetSubcategoryItemsPrice({
					budgetId,
					categoryId,
					subcategoryId,
				})
			);
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente en el subrubro',
				})
			);
			return { id: res.id, categoryId, subcategoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el ítem en el subrubro',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Actualizar un ítem de precio
export const updateBudgetItemPrice = createAsyncThunk(
	'budgets/updateBudgetItemPrice',
	async (
		{ budgetId, categoryId, subcategoryId, itemId, type, values },
		{ dispatch }
	) => {
		try {
			// Validar `type`
			if (!['subcategory', 'category'].includes(type)) {
				throw new Error('Nivel de búsqueda inválido');
			}
			let itemRef;
			// Determina la referencia del documento según el nivel
			if (type === 'subcategory') {
				itemRef = doc(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryId,
					'subcategories',
					subcategoryId,
					'items',
					itemId
				);
			} else if (type === 'category') {
				itemRef = doc(
					db,
					'budgets',
					budgetId,
					'categories',
					categoryId,
					'items',
					itemId
				);
			}
			const cleanedValues = cleanObject(values);
			// Actualiza el documento
			await updateDoc(itemRef, cleanedValues);
			// Actualiza el estado del ítem
			dispatch(
				getBudgetItemPrice({
					budgetId,
					categoryId,
					subcategoryId,
					itemId,
					type,
				})
			);
			dispatch(getBudgetCategoryItemsPrice({ budgetId, categoryId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem actualizado exitosamente',
				})
			);
			return { itemId, updatedData: values };
		} catch (error) {
			dispatch(
				showToast({ type: 'error', message: 'Error al actualizar el ítem' })
			);
			console.error(error);
			throw error;
		}
	}
);

// Eliminar un ítem de precio
export const deleteBudgetItemPrice = createAsyncThunk(
	'budgets/deleteBudgetItemPrice',
	async ({ budgetId, categoryId, subcategoryId, itemId }, { dispatch }) => {
		try {
			// Determina la referencia del documento según si es subcategoría o categoría
			const itemRef = subcategoryId
				? doc(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items',
						itemId
				  )
				: doc(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'items',
						itemId
				  );
			// Elimina el documento
			await deleteDoc(itemRef);
			// Actualiza el estado de los ítems
			dispatch(getBudgetCategoryItemsPrice({ budgetId, categoryId }));
			if (subcategoryId) {
				dispatch(
					getBudgetSubcategoryItemsPrice({
						budgetId,
						categoryId,
						subcategoryId,
					})
				);
			}
			// Muestra un mensaje de éxito
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem eliminado exitosamente',
				})
			);
			return { itemId };
		} catch (error) {
			dispatch(
				showToast({ type: 'error', message: 'Error al eliminar el ítem' })
			);
			console.error(error);
			throw error;
		}
	}
);

// Función para limpiar campos vacíos
const cleanObject = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([value]) => value !== undefined)
	);
};
