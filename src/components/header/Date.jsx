import { useState, useEffect } from 'react';

// COMPONENTE P MOSTRAR FECHA Y HORA EN EL HEADER
export const DateTime = () => {
	const [dateTime, setDateTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setDateTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return <div>{dateTime.toLocaleString()}</div>;
};
