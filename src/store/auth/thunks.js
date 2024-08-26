import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../../services/firebase';
import {
	doc,
	setDoc,
	getDoc,
	getDocs,
	query,
	collection,
	updateDoc,
} from 'firebase/firestore';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { showToast } from '../toast/slice';

// FUNCION REGISTRO DE USUARIOS
export const registerUser = createAsyncThunk(
	'user/registro',
	async (values, { rejectWithValue }) => {
		console.log(values);
		const { nombre, apellido, email, password, photoProfile, role } = values;

		try {
			const currentUser = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(currentUser);

			// Actualizar el perfil del usuario en Firebase Auth
			await updateProfile(auth.currentUser, {
				displayName: `${nombre} ${apellido}`,
				photoURL: photoProfile, // URL o cadena vacía
			});

			// Guardar datos adicionales del usuario en Firestore
			await setDoc(doc(db, 'users', currentUser.user.uid), {
				email: currentUser.user.email,
				fullName: currentUser.user.displayName,
				photoProfile: currentUser.user.photoURL,
				role: role,
				authMethod: currentUser.user.providerData.map(
					(prov) => prov.providerId
				),
			});

			// Obtener los datos del usuario recién creado
			const userDoc = await getDoc(doc(db, 'users', currentUser.user.uid));
			console.log(userDoc);
			return { uid: userDoc.id, ...userDoc.data() };
		} catch (error) {
			if (error.code === 'auth/email-already-in-use') {
				return rejectWithValue('Email en uso');
			} else {
				return rejectWithValue(error.code || 'Error al registrar');
			}
		}
	}
);

// FUNCION LOGIN CON CORREO ELECTRONICO
export const loginUserWithEmail = createAsyncThunk(
	'user/loginWithEmail',
	async ({ email, password }, { rejectWithValue, dispatch }) => {
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
			console.log(error.code);
			return rejectWithValue(error.code);
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
				fullName: currentUser.displayName,
				photoProfile: currentUser.photoURL,
				role: 'user',
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
export const logout = createAsyncThunk('user/logout', async () => {
	await signOut(auth);
});

// FUNCION VERIFICAR USUARIO LOGUEADO
export const verifyLoggedUser = createAsyncThunk(
	'user/login/email',
	async ({ rejectWithValue, dispatch }) => {
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
