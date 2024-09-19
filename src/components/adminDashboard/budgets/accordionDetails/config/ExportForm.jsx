/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import AccordionPrices from '../../../pricesBank/myBank/AccordionPrices';
import { useBudgetDetailsActions } from '../../../../../hooks/useBudgetDetailsActions';

export const ExportForm = ({ budgetId, onClose }) => {
	const selectedItems = useSelector((state) => state.prices.selectedItems);
	const { exportSelectedItems } = useBudgetDetailsActions();

	const handleExport = async () => {
		await exportSelectedItems({ selectedItems, budgetId });
		onClose();
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
