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

export const exportSelectedItems = createAsyncThunk(
	'category/exportSelectedItems',
	async ({ dataToExport }, { dispatch }) => {
		try {
			console.log(dataToExport);
			dispatch(
				showToast({
					type: 'success',
					message: 'Exportacion realizada exitosamente',
				})
			);
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al exportar los datos',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getCategories = createAsyncThunk(
	'category/getCategories',
	async (_, { dispatch }) => {
		try {
			// Recuperar todas las categorías
			const categoriesSnapshot = await getDocs(collection(db, 'categories'));
			// Crear un array para almacenar las categorías con sus subcolecciones e ítems
			const categoriesWithDetails = await Promise.all(
				categoriesSnapshot.docs.map(async (categoryDoc) => {
					const categoryData = {
						uid: categoryDoc.id,
						...categoryDoc.data(),
					};
					// Recuperar ítems directamente dentro de la categoría
					const itemsSnapshot = await getDocs(
						collection(db, 'categories', categoryDoc.id, 'items')
					);
					const items = itemsSnapshot.docs.map((itemDoc) => ({
						uid: itemDoc.id,
						...itemDoc.data(),
					}));
					// Agregar ítems a la categoría
					categoryData.items = items;
					// Recuperar subcategorías si existen
					const subcategoriesSnapshot = await getDocs(
						collection(db, 'categories', categoryDoc.id, 'subcategories')
					);
					const subcategories = await Promise.all(
						subcategoriesSnapshot.docs.map(async (subDoc) => {
							const subData = { uid: subDoc.id, ...subDoc.data() };
							// Recuperar ítems de la subcategoría si existen
							const subItemsSnapshot = await getDocs(
								collection(
									db,
									'categories',
									categoryDoc.id,
									'subcategories',
									subDoc.id,
									'items'
								)
							);
							const subItems = subItemsSnapshot.docs.map((itemDoc) => ({
								uid: itemDoc.id,
								...itemDoc.data(),
							}));
							// Agregar ítems a la subcategoría
							subData.items = subItems;
							return subData;
						})
					);
					// Agregar subcategorías a la categoría
					categoryData.subcategories = subcategories;
					return categoryData;
				})
			);
			return categoriesWithDetails;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener las categorias',
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
	async ({ categoryId, values }, { dispatch }) => {
		try {
			const itemRef = categoryId
				? collection(db, 'categories', categoryId, 'subcategories')
				: collection(db, 'categories');
			const res = await addDoc(itemRef, values);
			dispatch(getCategories());
			const message = categoryId
				? 'SubCategoria creada exitosamente'
				: 'Categoria creada exitosamente';
			dispatch(
				showToast({
					type: 'success',
					message,
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
	async ({ categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemRef = subcategoryId
				? doc(db, 'categories', categoryId, 'subcategories', subcategoryId)
				: doc(db, 'categories', categoryId);
			await getDoc(itemRef);
			await updateDoc(itemRef, values);
			dispatch(getCategories());
			const message = subcategoryId
				? 'SubCategoria actualizada exitosamente'
				: 'Categoria actualizada exitosamente';
			dispatch(
				showToast({
					type: 'success',
					message,
				})
			);
			return { subcategoryId, updatedData: values };
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
	async ({ categoryId, subcategoryId }, { dispatch }) => {
		try {
			const itemRef = subcategoryId
				? doc(db, 'categories', categoryId, 'subcategories', subcategoryId)
				: doc(db, 'categories', categoryId);
			// Eliminar subcategorías e items
			const subcategoriesSnapshot = await getDocs(
				collection(itemRef, 'subcategories')
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
			await deleteDoc(itemRef);
			dispatch(getCategories());
			const message = subcategoryId
				? 'SubCategoria eliminada exitosamente'
				: 'Categoria eliminada exitosamente';
			dispatch(
				showToast({
					type: 'success',
					message,
				})
			);
			return { categoryId };
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

// Obtener precios de ítems de una categoría o subcategoria
export const getItemsPrice = createAsyncThunk(
	'category/getCategoryItemsPrice',
	async ({ categoryId, subcategoryId }, { dispatch }) => {
		try {
			const itemsRef = subcategoryId
				? collection(
						db,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items'
				  )
				: collection(db, 'categories', categoryId, 'items');
			const itemsSnapshot = await getDocs(itemsRef);
			const items = itemsSnapshot.docs.map((doc) => ({
				uid: doc.id,
				...doc.data(),
			}));
			return {
				categoryId,
				subcategoryId: subcategoryId || null,
				items,
			};
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

// Obtener detalles de un ítem específico
export const getItemPrice = createAsyncThunk(
	'category/getItemPrice',
	async ({ categoryId, subcategoryId, itemId }, { dispatch }) => {
		try {
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
			const itemSnapshot = await getDoc(itemRef);
			return {
				...itemSnapshot.data(),
				uid: itemSnapshot.id,
				categoryId,
				subcategoryId,
			};
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al obtener datos del ítem',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

// Crear un ítem de precio en una categoría
export const createItemPrice = createAsyncThunk(
	'category/createItemPrice',
	async ({ categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemsRef = subcategoryId
				? collection(
						db,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items'
				  )
				: collection(db, 'categories', categoryId, 'items');
			await addDoc(itemsRef, values);
			dispatch(
				getItemsPrice({
					categoryId,
					subcategoryId,
				})
			);
			dispatch(getCategories());
			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente',
				})
			);
			return { categoryId, subcategoryId };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al crear el ítem',
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
	async ({ categoryId, subcategoryId, itemId, values }, { dispatch }) => {
		try {
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
			const cleanedValues = cleanObject(values);
			await updateDoc(itemRef, cleanedValues);
			dispatch(getCategories());
			dispatch(
				getItemPrice({
					categoryId,
					subcategoryId,
					itemId,
				})
			);
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
			await deleteDoc(itemRef);
			dispatch(getCategories());
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
