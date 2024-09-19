import { useBudgetActions } from '../../../../hooks/useBudgetActions';
import { formatCurrency } from '../../../../utils/FormatCurrency';
import { useBudgetDetailsActions } from '../../../../hooks/useBudgetDetailsActions';

export const ResumeBudget = () => {
	const { configValues } = useBudgetActions();
	const { categories } = useBudgetDetailsActions();

	const calculateTotalPrice = (categories) => {
		let total = 0;
		const calculateItemsPrice = (items) => {
			return items.reduce((sum, item) => {
				const finalPrice = parseFloat(item.finalPrice) || 0;
				const measurement = parseFloat(item.measurement) || 1;
				return sum + finalPrice * measurement;
			}, 0);
		};

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

	const totalPriceWithBenefits = isNaN(totalPrice)
		? 0
		: totalPrice * (1 + configValues.benefits / 100);

	const anteproyectFeeAmount = isNaN(totalPrice)
		? 0
		: totalPrice * (configValues.anteproyectFee / 100);
	const proyectFeeAmount = isNaN(totalPrice)
		? 0
		: totalPrice * (configValues.proyectFee / 100);
	const dtFeeAmount = isNaN(totalPrice)
		? 0
		: totalPrice * (configValues.dtFee / 100);
	const adminFeeAmount = isNaN(totalPrice)
		? 0
		: totalPrice * (configValues.adminFee / 100);

	const totalFees =
		anteproyectFeeAmount + proyectFeeAmount + dtFeeAmount + adminFeeAmount;

	const totalBudget = totalPriceWithBenefits + totalFees;

	return (
		<div className='flex flex-row py-3 flex-wrap w-full items-center justify-around border-2 mb-3 border-slate-600'>
			<div>
				<div className='flex flex-col items-center justify-center text-center'>
					<p className='font-bold text-lg'>Costo Real</p>
					<span className='font-semibold pt-2'>
						{isNaN(totalPrice)
							? '$ 0'
							: formatCurrency(totalPrice.toFixed(2))}
					</span>
				</div>
				<div className='flex flex-col items-center justify-center pt-3 text-center'>
					<p className='font-bold text-lg'>Margen Beneficio</p>
					<span className='pt-2'>{configValues.benefits} %</span>
				</div>
			</div>
			<div className='flex flex-col flex-wrap items-center justify-center text-center'>
				<p className='text-lg font-bold'>
					Honorarios{' '}
					<span>
						{isNaN(totalFees)
							? '$ 0'
							: formatCurrency(totalFees.toFixed(2))}
					</span>
				</p>
				<div className='flex flex-row flex-wrap items-center justify-center gap-2 border-2 p-2 border-gray-400'>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>AnteProyecto</p>
						<span>{configValues.anteproyectFee} %</span>
						<span className='font-semibold'>
							{isNaN(anteproyectFeeAmount)
								? '$ 0'
								: formatCurrency(anteproyectFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>Proyecto</p>
						<span>{configValues.proyectFee} %</span>
						<span className='font-semibold'>
							{isNaN(proyectFeeAmount)
								? '$ 0'
								: formatCurrency(proyectFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>D. T.</p>
						<span>{configValues.dtFee} %</span>
						<span className='font-semibold'>
							{isNaN(dtFeeAmount)
								? '$ 0'
								: formatCurrency(dtFeeAmount.toFixed(2))}
						</span>
					</div>
					<div className='flex flex-col items-center justify-center text-center'>
						<p className='font-semibold'>Administracion</p>
						<span>{configValues.adminFee} %</span>
						<span className='font-semibold'>
							{isNaN(adminFeeAmount)
								? '$ 0'
								: formatCurrency(adminFeeAmount.toFixed(2))}
						</span>
					</div>
				</div>
			</div>

			<div className='flex flex-col items-center justify-center'>
				<p className='font-bold text-xl'>Total Presupuesto</p>
				<span className='font-bold text-xl'>
					{isNaN(totalBudget)
						? '$ 0'
						: formatCurrency(totalBudget.toFixed(2))}
				</span>
			</div>
		</div>
	);
};
