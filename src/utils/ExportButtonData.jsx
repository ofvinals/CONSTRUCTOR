import { useSelector } from 'react-redux';
import Modals from './Modals';
import { useRef, useState } from 'react';
import useModal from '../hooks/useModal';
import { Menu } from 'primereact/menu';
import { FormBudgets } from '../components/adminDashboard/pricesBank/myBank/FormBudgets';
import { handleExportToExcel } from './handleExportExcel';

export const ExportDataButton = () => {
	const category = useSelector((state) => state.prices.category);
	const selectedItems = useSelector((state) => state.prices.selectedItems);
	const categories = useSelector((state) => state.prices.categories);
	const menuRef = useRef(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const editModal = useModal();

	const handleClose = () => {
		setIsModalVisible(false);
	};

	const handleSelectBudget = () => {
		setIsModalVisible(true);
	};

	const items = [
		{
			label: 'Descargar PDF',
			icon: 'pi pi-file-pdf text-xl text-yellow-800',
			command: () => {
				editModal.openModal();
			},
		},
		{
			label: 'Exportar a Presupuesto',
			icon: 'pi pi-money-bill text-xl text-blue-500',
			command: handleSelectBudget,
		},
		{
			label: 'Exporta a Excel',
			icon: 'pi pi-file-excel text-xl  text-green-500 ',
			command: () =>
				handleExportToExcel({ categories, selectedItems, category }),
		},
	];

	return (
		<div>
			<button
				onClick={(e) => {
					e.stopPropagation();
					menuRef.current.toggle(e);
				}}
				className='btnprimary disabled:bg-gray-400 h-[40px]'
				disabled={!(selectedItems && Object.keys(selectedItems.categories || {}).length > 0)}>
				<i className='pi pi-upload mr-2'></i>
				Exportar Datos Seleccionados
				<Menu model={items} popup ref={menuRef} />
			</button>
			<Modals
				isOpen={isModalVisible}
				onClose={handleClose}
				title='Exportar Datos a Presupuesto'>
				<FormBudgets
					onClose={handleClose}
					category={category}
					selectedItems={selectedItems}
				/>
			</Modals>
		</div>
	);
};
