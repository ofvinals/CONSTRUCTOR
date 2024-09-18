/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { formatCurrency } from '../../../../utils/FormatCurrency'; 

export const CostSummary = ({ totalItems, laborPrice }) => {
	const [laborCost, setLaborCost] = useState(0);
	const [materialsCost, setMaterialsCost] = useState(0);

	useEffect(() => {
		setLaborCost(Number(laborPrice) || 0);
		setMaterialsCost(Number(totalItems) || 0);
	}, [totalItems, laborPrice]);

	const totalCost = laborCost + materialsCost;

	return (
		<div className='w-full flex flex-row items-center justify-around my-3'>
			<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
				<p className='font-bold text-center h-[50%] text-xl'>
					Costo Mano de Obra
				</p>
				<span className='mt-3 font-semibold text-xl'>
					{formatCurrency(laborCost)}
				</span>
			</div>
			<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
				<p className='font-bold text-center h-[50%] text-xl'>
					Costo Materiales y Maquinaria
				</p>
				<span className='mt-3 font-semibold text-xl'>
					{formatCurrency(materialsCost)}
				</span>
			</div>
			<div className='w-1/3 h-[120px] flex mx-2 flex-wrap flex-col items-center justify-center border-2 rounded-md border-slate-400'>
				<p className='font-bold text-center h-[50%] text-xl'>Costo Total</p>
				<span className='mt-3 font-semibold text-xl'>
					{formatCurrency(totalCost)}
				</span>
			</div>
		</div>
	);
};
