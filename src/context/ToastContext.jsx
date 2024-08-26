/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
	const toast = useRef(null);

	return (
		<ToastContext.Provider value={toast}>
			<Toast ref={toast} />
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast debe ser usado dentro de un ToastProvider');
	}
	return context;
};
