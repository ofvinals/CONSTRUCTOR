import { useNavigate } from 'react-router-dom';
import {
	loginUserWithEmail,
	loginUserWithGoogle,
	logoutUser,
	registerUser,
} from '../store/user/thunks';
import { useAppDispatch, useAppSelector } from './store';

export function useAuth() {
	const loggedUser = useAppSelector((state) => state.user.loggedUser);
	const statusSign = useAppSelector((state) => state.user.statusSign);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const loginGoogle = async () => {
		try {
			const userAction = await dispatch(loginUserWithGoogle()).unwrap();
			const user = userAction;
			navigate('/admin');
		} catch (error) {
			alert(error);
		}
	};

	const loginEmail = async ({ email, password }) => {
		try {
			const userAction = await dispatch(
				loginUserWithEmail({ email, password })
			).unwrap();
			console.log(userAction);
			const user = userAction;
				navigate('/admin');

			return user;
		} catch (error) {
			alert(error);
		}
	};

	const registro = async (values) => {
		console.log(values);
		try {
			const res = await dispatch(registerUser(values));
			console.log(res);

			navigate('/admin');
		} catch (error) {
			alert(error);
		}
	};

	const logout = () => {
		dispatch(logoutUser());
		navigate('/home');
	};

	return {
		loggedUser,
		loginGoogle,
		loginEmail,
		registro,
		logout,
		statusSign,
	};
}
