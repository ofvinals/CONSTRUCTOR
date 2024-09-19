import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../services/firebase';
import {
	doc,
	addDoc,
	getDoc,
	getDocs,
	setDoc,
	deleteDoc,
	collection,
	updateDoc,
} from 'firebase/firestore';
import { showToast } from '../toast/slice';

export const exportSelectedItems = createAsyncThunk(
	'category/exportSelectedItems',
	async ({ budgetId, selectedItems }, { dispatch }) => {
		try {
			const categoriesIds = Object.keys(selectedItems); // IDs de las categorías
			// Iterar sobre cada categoría
			await Promise.all(
				categoriesIds.map(async (categoryId) => {
					// Recuperar la categoría desde la colección prices
					const pricesRef = doc(db, 'categories', categoryId);
					const categorySnapshot = await getDoc(pricesRef);
					if (categorySnapshot.exists()) {
						const categoryData = {
							...categorySnapshot.data(),
							uid: categorySnapshot.id,
						};
						// Agregar la categoría al presupuesto
						const budgetCategoryRef = doc(
							db,
							'budgets',
							budgetId,
							'categories',
							categoryId
						);
						await setDoc(budgetCategoryRef, categoryData); // Cambiado a setDoc
						console.log(budgetCategoryRef);
						// Recuperar ítems de la categoría desde la colección prices
						const itemsSnapshot = await getDocs(
							collection(pricesRef, 'items')
						);
						const items = itemsSnapshot.docs.map((itemDoc) => ({
							uid: itemDoc.id,
							...itemDoc.data(),
						}));
						// Agregar ítems a la subcolección de categorías en el presupuesto
						await Promise.all(
							items.map(async (item) => {
								await setDoc(
									doc(
										db,
										'budgets',
										budgetId,
										'categories',
										categoryId,
										'items',
										item.uid
									),
									item
								);
							})
						);
					}
				})
			);
			dispatch(getBudgets({ budgetId }));
			dispatch(
				showToast({
					type: 'success',
					message: 'Datos importados exitosamente',
				})
			);
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al importar datos',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getBudgets = createAsyncThunk(
	'budgets/getBudgets',
	async ({ budgetId }, { dispatch }) => {
		try {
			// Recuperar todas las categorías
			const categoriesSnapshot = await getDocs(
				collection(db, 'budgets', budgetId, 'categories')
			);
			// Crear un array para almacenar las categorías con sus subcolecciones e ítems
			const categoriesWithDetails = await Promise.all(
				categoriesSnapshot.docs.map(async (categoryDoc) => {
					const categoryData = {
						uid: categoryDoc.id,
						...categoryDoc.data(),
					};
					// Recuperar ítems directamente dentro de la categoría
					const itemsSnapshot = await getDocs(
						collection(
							db,
							'budgets',
							budgetId,
							'categories',
							categoryDoc.id,
							'items'
						)
					);
					const items = itemsSnapshot.docs.map((itemDoc) => ({
						uid: itemDoc.id,
						...itemDoc.data(),
					}));
					// Agregar ítems a la categoría
					categoryData.items = items;
					// Recuperar subcategorías si existen
					const subcategoriesSnapshot = await getDocs(
						collection(
							db,
							'budgets',
							budgetId,
							'categories',
							categoryDoc.id,
							'subcategories'
						)
					);
					const subcategories = await Promise.all(
						subcategoriesSnapshot.docs.map(async (subDoc) => {
							const subData = { uid: subDoc.id, ...subDoc.data() };
							// Recuperar ítems de la subcategoría si existen
							const subItemsSnapshot = await getDocs(
								collection(
									db,
									'budgets',
									budgetId,
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
					message: 'Error al obtener los rubros',
				})
			);
			console.error(error);
			throw error;
		}
	}
);

export const getBudget = createAsyncThunk(
	'budgets/getBudget',
	async ({ budgetId, categoryId }, { dispatch }) => {
		try {
			const categoryRef = doc(
				db,
				'budgets',
				budgetId,
				'categories',
				categoryId
			);
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

export const createBudget = createAsyncThunk(
	'budgets/createBudget',
	async ({ budgetId, categoryId, values }, { dispatch }) => {
		try {
			const itemRef = categoryId
				? collection(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories'
				  )
				: collection(db, 'budgets', budgetId, 'categories');
			await addDoc(itemRef, values);
			dispatch(getBudgets({ budgetId }));
			const message = categoryId
				? 'SubRubro creado exitosamente'
				: 'Rubro creado exitosamente';
			dispatch(
				showToast({
					type: 'success',
					message,
				})
			);
			return { budgetId, categoryId };
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

export const updateBudget = createAsyncThunk(
	'budgets/updateBudget',
	async ({ budgetId, categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemRef = subcategoryId
				? doc(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId
				  )
				: doc(db, 'budgets', budgetId, 'categories', categoryId);
			await getDoc(itemRef);
			await updateDoc(itemRef, values);
			dispatch(getBudgets({ budgetId }));
			const message = subcategoryId
				? 'SubRubro actualizado exitosamente'
				: 'Rubro actualizado exitosamente';
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
					message: 'Error al actualizar el rubro',
				})
			);
			console.error('Error:', error);
			throw error;
		}
	}
);

export const deleteBudget = createAsyncThunk(
	'budgets/deleteBudget',
	async ({ budgetId, categoryId, subcategoryId }, { dispatch }) => {
		try {
			const itemRef = subcategoryId
				? doc(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId
				  )
				: doc(db, 'budgets', budgetId, 'categories', categoryId);
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
			dispatch(getBudgets({ budgetId }));
			const message = subcategoryId
				? 'SubRubro eliminado exitosamente'
				: 'Rubro eliminado exitosamente';
			dispatch(
				showToast({
					type: 'success',
					message,
				})
			);
			return { budgetId, categoryId };
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

// Obtiene precios de todos los ítems de una categoría o subcategoria
export const getItemsPrice = createAsyncThunk(
	'budgets/getItemsPrice',
	async ({ budgetId, categoryId, subcategoryId }, { dispatch }) => {
		try {
			const itemsRef = subcategoryId
				? collection(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items'
				  )
				: collection(
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
			return {
				categoryId,
				subcategoryId: subcategoryId || null,
				items,
			};
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

// Obtiene detalles de un ítem específico en categoria o subcategoria
export const getItemPrice = createAsyncThunk(
	'budgets/getItemPrice',
	async ({ budgetId, categoryId, subcategoryId, itemId }, { dispatch }) => {
		console.log(budgetId, categoryId, subcategoryId, itemId);
		try {
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

// Crea un ítem de precio en una categoria o  subcategoría
export const createItemPrice = createAsyncThunk(
	'budgets/createItemPrice',
	async ({ budgetId, categoryId, subcategoryId, values }, { dispatch }) => {
		try {
			const itemsRef = subcategoryId
				? collection(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'subcategories',
						subcategoryId,
						'items'
				  )
				: collection(
						db,
						'budgets',
						budgetId,
						'categories',
						categoryId,
						'items'
				  );
			const res = await addDoc(itemsRef, values);
			dispatch(getBudgets({ budgetId }));
			dispatch(
				getItemsPrice({
					budgetId,
					categoryId,
					subcategoryId,
				})
			);

			dispatch(
				showToast({
					type: 'success',
					message: 'Ítem creado exitosamente.',
				})
			);
			return { id: res.id, categoryId, subcategoryId };
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

// Actualiza un ítem de precio en categoria o subcategoria
export const updateItemPrice = createAsyncThunk(
	'budgets/updateItemPrice',
	async (
		{ budgetId, categoryId, subcategoryId, itemId, values },
		{ dispatch }
	) => {
		try {
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
			const cleanedValues = cleanObject(values);
			await updateDoc(itemRef, cleanedValues);
			dispatch(getBudgets({ budgetId }));
			dispatch(
				getItemPrice({
					budgetId,
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

// Elimina un ítem de precio en categoria o subcategoria
export const deleteItemPrice = createAsyncThunk(
	'budgets/deleteItemPrice',
	async ({ budgetId, categoryId, subcategoryId, itemId }, { dispatch }) => {
		try {
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
			await deleteDoc(itemRef);
			dispatch(getBudgets({ budgetId }));
			dispatch(getItemPrice({ budgetId, categoryId, subcategoryId }));
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
