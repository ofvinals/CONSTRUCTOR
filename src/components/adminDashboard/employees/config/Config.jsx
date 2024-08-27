import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Modals from '../../../../utils/Modals';
import ConfigForm from './ConfigForm';

export const Config = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const navigate = useNavigate();

	const handleClose = () => {
		setIsModalVisible(false);
		navigate('/employees');
	};

	useEffect(() => {
		setIsModalVisible(true);
	}, []);

	return (
		<div>
			<Modals
				isOpen={isModalVisible}
				onClose={handleClose}
				title='Configurar Valores'>
				<ConfigForm onClose={handleClose} />
			</Modals>
		</div>
	);
};
