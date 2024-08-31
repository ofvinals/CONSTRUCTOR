import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'primereact/button';
import { CardSettlement } from './CardSettlement';
import { format } from 'date-fns';

export const Salary = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const formattedStartDate = startDate ? format(startDate, 'yyyy/MM/dd') : '';
	const formattedEndDate = endDate ? format(endDate, 'yyyy/MM/dd') : '';

	return (
		<div className='min-h-screen'>
			<div className='flex flex-wrap flex-row items-center justify-center sm:justify-between my-3 mx-2'>
				<h1 className='title'>Liquidacion de Jornales</h1>
				<div className='flex flex-row flew-wrap items-center justify-center'>
					<DatePicker
						dateFormat='dd/MM/yyyy'
						selected={startDate}
						onChange={onChange}
						startDate={startDate}
						endDate={endDate}
						selectsRange
						className='border-2 border-[#ffd52b] p-2'
					/>
					<Button className='btnprimary  text-center ml-5 p-2'>
						<i className='pi pi-print mr-2 '></i>
						Imprimir Liquidacion
					</Button>
				</div>
			</div>
			<CardSettlement
				startDate={formattedStartDate}
				endDate={formattedEndDate}
			/>
		</div>
	);
};
