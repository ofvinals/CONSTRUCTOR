/* eslint-disable react/prop-types */
import { createContext } from 'react';
import { useLoad } from '../hooks/useLoad';

export const AppContext = createContext();

export function AppProvider({ children }) {
	const { isLoading } = useLoad();

	return (
		<AppContext.Provider value={{ isLoading }}>
			{children}
		</AppContext.Provider>
	);
}
export default AppContext;
