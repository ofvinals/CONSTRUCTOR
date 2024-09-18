/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import Modals from '../../../../../utils/Modals';
import ConfigForm from './ConfigForm';
import { ExportForm } from './ExportForm';

export const MenuConfig = ({ budgetId }) => {
	const menuRef = useRef(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalExportVisible, setIsModalExportVisible] = useState(false);

	const handleClose = () => {
		setIsModalVisible(false);
		setIsModalExportVisible(false);
	};

	const handleEditMargin = () => {
		setIsModalVisible(true);
	};
	const handleExportPrices = () => {
		setIsModalExportVisible(true);
	};

	const items = [
		{
			label: 'Personalizar PDF',
			icon: 'pi pi-pencil text-xl text-green-500',
			// command: () => {
			// 	editModal.openModal();
			// },
		},
		{
			label: 'Modificar Valores',
			icon: 'pi pi-money-bill text-xl text-blue-500',
			command: () => {
				handleEditMargin();
			},
		},
		{
			label: 'Importar Banco de Precios',
			icon: 'pi pi-file-import text-xl  text-yellow-800',
			command: () => {
				handleExportPrices();
			},
		},
	];

	return (
		<>
			<div className=''>
				<Button
					className='shadow-none btnicon mr-2 p-0'
					icon='pi pi-cog'
					onClick={(e) => {
						e.stopPropagation();
						menuRef.current.toggle(e);
					}}
				/>
				<Menu model={items} popup ref={menuRef} />
			</div>
			<Modals
				isOpen={isModalVisible}
				onClose={handleClose}
				title='Modificar Valores'>
				<ConfigForm onClose={handleClose} budgetId={budgetId} />
			</Modals>
			<Modals
				isOpen={isModalExportVisible}
				onClose={handleClose}
				size='lg'
				title='Exportar Banco de Precios'>
				<ExportForm isBudget={true} budgetId={budgetId} />
			</Modals>
		</>
	);
};
