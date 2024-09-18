/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import AccordionPrices from '../../../pricesBank/myBank/AccordionPrices';
import { usePriceActions } from '../../../../../hooks/usePriceActions';

export const ExportForm = ({ budgetId }) => {
	const selectedItems = useSelector((state) => state.prices.selectedItems);
	const categories = useSelector((state) => state.prices.categories);
	const { exportSelectedItems } = usePriceActions();
	console.log(categories);
	console.log(selectedItems);

	const handleExport = async () => {
		// Prepara los datos para el presupuesto
		const dataToExport = {
			budgetId,
			items: selectedItems,
		};
		await exportSelectedItems(dataToExport);
	};

	return (
		<div>
			<div>
				<AccordionPrices isBudget={true} />
			</div>
			<div className='flex flex-row flex-wrap items-center justify-center'>
				<button className='btnprimary' onClick={handleExport}>
					<i className='pi pi-file-export mr-2'></i>Exportar Datos
					Seleccionados
				</button>
			</div>
		</div>
	);
};
