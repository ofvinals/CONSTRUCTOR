import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../services/firebase';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
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
		console.log(values);
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
			const usersRef = collection(db, 'users');
			const userData = {
				...values,
				admin: false,
				active: true,
				displayName: displayNameValue,
			};
			const res = await addDoc(usersRef, userData);
			dispatch(getUsers());
			dispatch(
				showToast({
					type: 'success',
					message: 'Cliente creado exitosamente',
				})
			);
			return { id: res.id, ...userData };
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
	async ({ values }, { rejectWithValue, dispatch }) => {
		const { email, password } = values;
		try {
			const signWithEmail = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			const userDoc = await getDoc(doc(db, 'users', signWithEmail.user.uid));
			dispatch(
				showToast({
					type: 'success',
					message: 'Usuario logueado exitosamente',
				})
			);
			return { uid: userDoc.id, ...userDoc.data() };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al iniciar sesion',
				})
			);
			console.log(error.response.data);
			return rejectWithValue(error.response.data);
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

			await setDoc(doc(db, 'users', currentUser.uid), {
				email: currentUser.email,
				displayName: currentUser.displayName,
				photoProfile: currentUser.photoURL,
				admin: true,
				authMethod: currentUser.providerData.map((prov) => prov.providerId),
			});

			const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
			dispatch(
				showToast({
					type: 'success',
					message: 'Inicio de sesion con Google exitoso',
				})
			);
			return { uid: userDoc.id, ...userDoc.data() };
		} catch (error) {
			dispatch(
				showToast({
					type: 'error',
					message: 'Error al iniciar sesion con Google',
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
