import { useBudgetActions } from '../../../../hooks/useBudgetActions';
import { formatCurrency } from '../../../../utils/FormatCurrency';
import { useBudgetDetailsActions } from '../../../../hooks/useBudgetDetailsActions';

export const ResumeBudget = () => {
	const { configValues } = useBudgetActions();
	const { categories } = useBudgetDetailsActions();

	// Función para calcular el total de precios
	const calculateTotalPrice = (categories) => {
		let total = 0;
		// Calcula el precio total de los ítems
		const calculateItemsPrice = (items) => {
			return items.reduce((sum, item) => {
				const finalPrice = parseFloat(item.finalPrice) || 0;
				const measurement = parseFloat(item.measurement) || 1;
				return sum + finalPrice * measurement;
			}, 0);
		};
		// Itera sobre cada categoría
		const processCategory = (category) => {
			total += calculateItemsPrice(category.items || []);
			if (category.subcategories && category.subcategories.length > 0) {
				category.subcategories.forEach((subcategory) => {
					total += calculateItemsPrice(subcategory.items || []);
					processCategory(subcategory);
				});
			}
		};
		if (categories) {
			categories.forEach((category) => processCategory(category));
		}
		return total;
	};
	
	const totalPrice = categories ? calculateTotalPrice(categories) : 0;

	// Calcula el precio total con beneficio
	const totalPriceWithBenefits =
		totalPrice * (1 + configValues.benefits / 100);

	// Calcula los honorarios
	const anteproyectFeeAmount =
		totalPrice * (configValues.anteproyectFee / 100);
	const proyectFeeAmount = totalPrice * (configValues.proyectFee / 100);
	const dtFeeAmount = totalPrice * (configValues.dtFee / 100);
	const adminFeeAmount = totalPrice * (configValues.adminFee / 100);

	// Total de honorarios
	const totalFees =
		anteproyectFeeAmount + proyectFeeAmount + dtFeeAmount + adminFeeAmount;

	// Total presupuesto
	const totalBudget = totalPriceWithBenefits + totalFees;

	return (
		<div className='flex flex-row py-3 flex-wrap w-full items-center justify-around border-2 mb-3 border-slate-600'>
			<div>
				<div className='flex flex-col items-center justify-center text-center'>
					<p className='font-bold text-lg'>Costo Real</p>
					<span className='font-semibold pt-2'>
						{formatCurrency(totalPrice.toFixed(2))}
					</span>
				</div>
				<div className='flex flex-col items-center justify-center pt-3 text-center'>
					<p className='font-bold text-lg'>Margen Beneficio</p>
					<span className='pt-2'>{configValues.benefits} %</span>
				</div>
			</div>
			<div className='flex flex-col flex-wrap items-center justify-center text-center'>
				<p className='text-lg font-bold'>
					Honorarios <span>{formatCurrency(totalFees.toFixed(2))}</span>
				</p>
				<div className='flex flex-row flex-wrap items-center justify-center gap-2 border-2 p-2 border-gray-400'>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>AnteProyecto</p>
						<span>{configValues.anteproyectFee} %</span>
						<span className='font-semibold'>
							{formatCurrency(anteproyectFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>Proyecto</p>
						<span>{configValues.proyectFee} %</span>
						<span className='font-semibold'>
							{formatCurrency(proyectFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>D. T.</p>
						<span>{configValues.dtFee} %</span>
						<span className='font-semibold'>
							{formatCurrency(dtFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>Administracion</p>
						<span>{configValues.adminFee} %</span>
						<span className='font-semibold'>
							{formatCurrency(adminFeeAmount.toFixed(2))}
						</span>
					</div>
				</div>
			</div>

			<div className='flex flex-col items-center justify-center'>
				<p className='font-bold text-xl'>Total Presupuesto</p>
				<span className='font-bold text-xl'>
					{formatCurrency(totalBudget.toFixed(2))}
				</span>
			</div>
		</div>
	);
};
