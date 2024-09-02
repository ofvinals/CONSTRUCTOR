import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'primereact/button';
import { CardSettlement } from './CardSettlement';
import { format } from 'date-fns';
import { SalaryGeneratePDF } from '../../../../utils/SalaryGeneratePDF';

export const Salary = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null);
	const [employeeData, setEmployeeData] = useState([]);

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const formattedStartDate = startDate ? format(startDate, 'yyyy/MM/dd') : '';
	const formattedEndDate = endDate ? format(endDate, 'yyyy/MM/dd') : '';

	return (
		<div>
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
					<SalaryGeneratePDF
						employees={employeeData}
						startDate={startDate}
						endDate={endDate}
					/>
					<Button className='btnprimary ml-3'>
						<i className='pi pi-money-bill mr-2 text-xl'></i>
						Registrar pago del periodo
					</Button>
				</div>
			</div>
			<CardSettlement
				startDate={formattedStartDate}
				endDate={formattedEndDate}
				setEmployeeData={setEmployeeData}
			/>
		</div>
	);
};
