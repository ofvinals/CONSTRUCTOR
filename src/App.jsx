import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toast } from 'primereact/toast';
import { useToast } from '../src/context/ToastContext';
import { clearToast } from '../src/store/toast/slice';
import { AppRouter } from '../router/AppRouter';

function App() {
	const toast = useToast();
	const dispatch = useDispatch();
	const { message, type } = useSelector((state) => state.toast);

	useEffect(() => {
		if (message && type) {
			toast.current.show({
				severity: type,
				summary: type.charAt(0).toUpperCase() + type.slice(1),
				detail: message,
			});
			dispatch(clearToast());
		}
	}, [message, type, toast, dispatch]);

	return (
		<div>
			<Toast ref={toast} />
			<AppRouter />
		</div>
	);
}

export default App;