import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'primereact/button';
import { CardSettlement } from './CardSettlement';

export const Salary = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);
	const [openSettlement, setOpenSettlement] = useState(false);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const handleDates = () => {
		setOpenSettlement(true);
	};

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
					<Button
						onClick={handleDates}
						className='btnprimary  text-center ml-5 p-2'>
						<i className=' text-xl text-center font-bold pi pi-check'></i>
					</Button>

					<Button
						onClick={handleDates}
						className='btnprimary  text-center ml-5 p-2'><i className='pi pi-print mr-2 font-semibold'></i>
						Imprimir Liquidacion
					</Button>
				</div>
			</div>
			{<CardSettlement startDate={startDate} endDate={endDate} />}
		</div>
	);
};
