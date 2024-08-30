import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from 'firebase/auth';
import { showToast } from '../toast/slice';
import { useUserActions } from '../../hooks/UseUserActions';
const { getUsers } = useUserActions;

// FUNCION REGISTRO DE USUARIOS
export const register = createAsyncThunk(
	'user/register',
	async ({ values }, { rejectWithValue, dispatch }) => {
		const { nombre, apellido, email, password } = values;

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const currentUser = userCredential.user;
			const displayNameValue = `${nombre} ${apellido}`;
			console.log(currentUser);
			await updateProfile(auth.currentUser, {
				displayName: displayNameValue,
			});
			const userDocRef = doc(db, 'users', currentUser.uid);
			const userData = {
				...values,
				admin: false,
				isActive: true,
				displayName: displayNameValue,
			};
			await setDoc(userDocRef, userData);
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Cliente creado exitosamente',
				})
			);
			return { id: currentUser.uid, ...userData };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al registrar el usuario',
				})
			);
			console.log(error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

// FUNCION LOGIN CON CORREO ELECTRONICO
export const login = createAsyncThunk(
	'user/login',
	async ({ email, password }, { dispatch }) => {
		try {
			// Iniciar sesión con email y contraseña
			const signWithEmail = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const id = signWithEmail.user.uid;
			// Obtener el documento del usuario desde Firestore
			const usuarioRef = doc(db, 'users', id);
			const snapshot = await getDoc(usuarioRef);
			// Verificar si el documento existe y tiene datos
			if (!snapshot.exists()) {
				console.error('Documento del usuario no encontrado');
				throw new Error('Documento del usuario no encontrado');
			}
			const userData = snapshot.data();
			console.log('Datos del usuario:', userData);
			dispatch(
				showToast({
					type: 'success',
					message: 'Usuario logueado exitosamente',
				})
			);
			return userData;
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al iniciar sesión',
				})
			);
			console.error('Error al iniciar sesión:', error.message || error);
			throw error;
		}
	}
);

// FUNCION LOGIN CON CUENTA GOOGLE
export const loginWithGoogle = createAsyncThunk(
	'user/loginGoogle',
	async (_, { rejectWithValue, dispatch }) => {
		const googleProvider = new GoogleAuthProvider();
		try {
			const res = await signInWithPopup(auth, googleProvider);
			const currentUser = res.user;
			const userRef = doc(db, 'users', currentUser.uid);
			// Obtener el documento del usuario
			const userDoc = await getDoc(userRef);
			// Si el documento no existe, lo creamos
			if (!userDoc.exists()) {
				await setDoc(
					userRef,
					{
						email: currentUser.email,
						displayName: currentUser.displayName,
						photoProfile: currentUser.photoURL,
						admin: true,
						authMethod: currentUser.providerData.map(
							(prov) => prov.providerId
						),
					},
					dispatch(
						showToast({
							type: 'success',
							message: 'Registro de usuario con Google exitoso',
						})
					)
				);
			} else {
				// Si el documento ya existe, solo actualizamos ciertos campos
				await setDoc(
					userRef,
					{
						email: currentUser.email,
						displayName: currentUser.displayName,
						photoProfile: currentUser.photoURL,
						authMethod: currentUser.providerData.map(
							(prov) => prov.providerId
						),
					},
					{ merge: true }
				); 
				dispatch(
					showToast({
						type: 'success',
						message: 'Inicio de sesión con Google exitoso',
					})
				);
			}
			// Obtener el documento actualizado del usuario
			const updatedUserDoc = await getDoc(userRef);
			// Devolver los datos del usuario
			return { uid: updatedUserDoc.id, ...updatedUserDoc.data() };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al iniciar sesión con Google',
				})
			);
			console.error(error);
			return rejectWithValue(error.message);
		}
	}
);

// FUNCION LOGOUT
export const logout = createAsyncThunk(
	'user/logout',
	async (_, { dispatch }) => {
		try {
			await signOut(auth);
			dispatch(
				showToast({
					type: 'success',
					message: 'Sesion cerrada exitosamente',
				})
			);
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al cerrar sesion',
				})
			);
			console.error('Error al cerrar sesión:', error);
			return error.message;
		}
	}
);

// FUNCION VERIFICAR USUARIO LOGUEADO
export const verifyLoggedUser = createAsyncThunk(
	'user/verifyLoggedUser',
	async () => {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, async (currentUser) => {
				if (currentUser) {
					const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

					resolve({ uid: userDoc.id, ...userDoc.data() });
				} else {
					resolve(null);
				}
			});
		});
	}
);
