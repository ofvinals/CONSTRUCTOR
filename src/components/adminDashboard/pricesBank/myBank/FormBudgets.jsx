/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import { Form, FormLabel } from 'react-bootstrap';
import { FormSelect, SaveButton } from '../../../../utils/Form';
import { useBudgetActions } from '../../../../hooks/useBudgetActions';
import { useEffect, useState } from 'react';
import { usePriceActions } from '../../../../hooks/usePriceActions';

export const FormBudgets = ({ onClose }) => {
	const { budgets, getBudgets } = useBudgetActions();
	const { exportSelectedItems } = usePriceActions();
	const [selectedBudget, setSelectedBudget] = useState(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		getBudgets();
	}, []);

	const handleBudgetChange = (event) => {
		const budgetId = event.target.value;
		const budget = budgets.find((b) => b.uid === budgetId);
		setSelectedBudget(budget);
	};

	const onSubmit = async (budgetId, values) => {
		try {
			console.log(budgetId, values);
			const dataToExport = {
				budgetId,
				items: values,
			};
			await exportSelectedItems(dataToExport);
			onClose();
		} catch (error) {
			console.error('Error al exportar los datos:', error);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit(onSubmit)}
			className='my-2 flex flex-col items-center justify-center'>
			<div className='w-full flex flex-row flex-wrap items-center justify-around gap-3'>
				<Form.Group className='flex flex-col items-center justify-around px-2'>
					<FormLabel className=' text-center subtitle '>
						Selecciona el presupuesto para exportar datos
					</FormLabel>
					<FormSelect
						name='budget'
						type='text'
						register={register}
						errors={errors}
						className='shadow-none border-none '
						selectOptions={budgets.map((budget) => ({
							label: budget.proyectName,
							value: budget.uid,
						}))}
						onChange={handleBudgetChange}
					/>
				</Form.Group>
			</div>
			{selectedBudget && (
				<div className='mt-3 flex items-center'>
					<img
						src={selectedBudget.photoProfile}
						alt={selectedBudget.proyectName}
						className='mr-2'
						style={{ width: '50px', height: '50px' }}
					/>
					<span>{selectedBudget.client.displayName}</span>
				</div>
			)}
			<div className='mt-3'>
				<SaveButton label='Exportar' />
			</div>
		</Form>
	);
};
