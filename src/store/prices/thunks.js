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

export const getCategories = createAsyncThunk(
	'category/getCategories',
	async (_, { dispatch }) => {
		const arrayAux = [];
		try {
			const querySnapshot = await getDocs(collection(db, 'categories'));
			querySnapshot.forEach((doc) => {
				arrayAux.push({ uid: doc.id, ...doc.data() });
			});
			return arrayAux;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener categorías',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getCategory = createAsyncThunk(
	'category/getCategory',
	async ({ id }, { dispatch }) => {
		try {
			const categoryRef = doc(db, 'categories', id);
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
					message: 'Error al obtener la categoría',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const createCategory = createAsyncThunk(
	'category/createCategory',
	async ({ values }, { dispatch }) => {
		try {
			const categoriesRef = collection(db, 'categories');
			const categoryData = { ...values };
			const res = await addDoc(categoriesRef, categoryData);
			dispatch(getCategories());
			dispatch(
				showToast({
					type: 'success',
					message: 'Categoría creada exitosamente',
				})
			);
			return { id: res.id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear la categoría',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateCategory = createAsyncThunk(
	'category/updateCategory',
	async ({ id, values }, { dispatch }) => {
		try {
			const categoryRef = doc(db, 'categories', id);
			await updateDoc(categoryRef, values);
			dispatch(getCategories());
			dispatch(
				showToast({
					type: 'success',
					message: 'Categoría actualizada exitosamente',
				})
			);
			return { id, updatedData: values };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la categoría',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteCategory = createAsyncThunk(
	'category/deleteCategory',
	async ({ id }, { dispatch }) => {
		console.log(id);
		try {
			const categoryRef = doc(db, 'categories', id);
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
			dispatch(getCategories());
			dispatch(
				showToast({
					type: 'success',
					message: 'Categoría eliminada exitosamente',
				})
			);
			return { id };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar la categoría',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const getSubcategories = createAsyncThunk(
	'category/getSubcategories',
	async ({ id }, { dispatch, getState }) => {
		const { subcategories } = getState().prices;
		// if (subcategories[id]) {
		// 	// Si las subcategorías ya están en el estado, no hacer nada
		// 	return { categoryId: id, subcategories: subcategories[id] };
		// }
		try {
			const categoryRef = doc(db, 'categories', id);
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
					message: 'Error al obtener las subcategorías',
				})
			);
			console.error('Error fetching subcategories:', error);
			throw error;
		}
	}
);

export const createSubcategory = createAsyncThunk(
	'category/createSubcategory',
	async ({ categoryId, values }, { dispatch }) => {
		try {
			const subcategoriesRef = collection(
				db,
				'categories',
				categoryId,
				'subcategories'
			);
			const subcategoryData = { ...values };
			const res = await addDoc(subcategoriesRef, subcategoryData);
			dispatch(getCategories());
			dispatch(getSubcategories({ categoryId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Subcategoría creada exitosamente',
				})
			);
			return { id: res.id, categoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear la subcategoría',
				})
			);
			console.error('Error:', error.message);
			return { error: error.message };
		}
	}
);

export const updateSubcategory = createAsyncThunk(
	'category/updateSubcategory',
	async ({ categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const subcategoryRef = doc(
				db,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId
			);
			await updateDoc(subcategoryRef, values);
			dispatch(getCategories());
			dispatch(
				showToast({
					type: 'success',
					message: 'Subcategoría actualizada exitosamente',
				})
			);
			return { subcategoryId, updatedData: values };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al actualizar la subcategoría',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteSubcategory = createAsyncThunk(
	'category/deleteSubcategory',
	async ({ categoryId, subcategoryId }, { dispatch }) => {
		try {
			const subcategoryRef = doc(
				db,
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
			dispatch(getCategories());
			dispatch(getSubcategories({ id: categoryId }));
			await deleteDoc(subcategoryRef);
			dispatch(
				showToast({
					type: 'success',
					message: 'Subcategoría eliminada exitosamente',
				})
			);
			return { subcategoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al eliminar la subcategoría',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

// Obtener precios de ítems de una categoría
export const getCategoryItemsPrice = createAsyncThunk(
	'category/getCategoryItemsPrice',
	async ({ categoryId }, { dispatch }) => {
		try {
			const itemsRef = collection(db, 'categories', categoryId, 'items');
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
					message: 'Error al obtener los precios de la categoría',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Obtener precios de ítems de una subcategoría
export const getSubcategoryItemsPrice = createAsyncThunk(
	'category/getSubcategoryItemsPrice',
	async ({ categoryId, subcategoryId }, { dispatch }) => {
		console.log(categoryId, subcategoryId);
		try {
			const itemsRef = collection(
				db,
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
			console.log(items);
			return { categoryId, subcategoryId, items };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener los precios de la subcategoría',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Obtener detalles de un ítem específico
export const getItemPrice = createAsyncThunk(
	'category/getItemPrice',
	async ({ categoryId, subcategoryId, itemId, type }, { dispatch }) => {
		try {
			let itemRef;
			// Determina la referencia del documento según el nivel
			if (type === 'subcategory') {
				// Buscar en una subcategoría
				itemRef = doc(
					db,
					'categories',
					categoryId,
					'subcategories',
					subcategoryId,
					'items',
					itemId
				);
			} else if (type === 'category') {
				// Buscar en una categoría directamente
				itemRef = doc(db, 'categories', categoryId, 'items', itemId);
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
export const createCategoryItemPrice = createAsyncThunk(
	'category/createCategoryItemPrice',
	async ({ categoryId, values }, { dispatch }) => {
		try {
			const itemsRef = collection(db, 'categories', categoryId, 'items');
			const res = await addDoc(itemsRef, values);
			dispatch(getCategoryItemsPrice(categoryId));
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente en la categoría',
				})
			);
			return { id: res.id, categoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el ítem en la categoría',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Crear un ítem de precio en una subcategoría
export const createSubcategoryItemPrice = createAsyncThunk(
	'category/createSubcategoryItemPrice',
	async ({ categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemsRef = collection(
				db,
				'categories',
				categoryId,
				'subcategories',
				subcategoryId,
				'items'
			);
			const res = await addDoc(itemsRef, values);
			dispatch(getSubcategoryItemsPrice({ categoryId, subcategoryId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente en la subcategoría',
				})
			);
			return { id: res.id, categoryId, subcategoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el ítem en la subcategoría',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Actualizar un ítem de precio
export const updateItemPrice = createAsyncThunk(
	'category/updateItemPrice',
	async (
		{ categoryId, subcategoryId, itemId, type, values },
		{ dispatch }
	) => {
		console.log(categoryId, subcategoryId, itemId, type, values)
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
					'categories',
					categoryId,
					'subcategories',
					subcategoryId,
					'items',
					itemId
				);
			} else if (type === 'category') {
				itemRef = doc(db, 'categories', categoryId, 'items', itemId);
			}
			const cleanedValues = cleanObject(values);
			// Actualiza el documento
			await updateDoc(itemRef, cleanedValues);
			// Actualiza el estado del ítem
			dispatch(getItemPrice({ categoryId, subcategoryId, itemId, type }));
			// Muestra un mensaje de éxito
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
export const deleteItemPrice = createAsyncThunk(
	'category/deleteItemPrice',
	async ({ categoryId, subcategoryId, itemId }, { dispatch }) => {
		try {
			// Determina la referencia del documento según si es subcategoría o categoría
			const itemRef = subcategoryId
				? doc(
						db,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items',
						itemId
				  )
				: doc(db, 'categories', categoryId, 'items', itemId);
			// Elimina el documento
			await deleteDoc(itemRef);
			// Actualiza el estado de los ítems
			dispatch(getCategoryItemsPrice(categoryId));
			if (subcategoryId) {
				dispatch(getSubcategoryItemsPrice({ categoryId, subcategoryId }));
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
		Object.entries(obj).filter(([key, value]) => value !== undefined)
	);
};