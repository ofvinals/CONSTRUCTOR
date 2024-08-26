import { useContext } from "react";
import AppContext from "./AppContext";

// funcion que retorna el contexto del objeto creado por useContext
export const useAuth = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('Error, no se creo el contexto!');
	}
	return context;
};