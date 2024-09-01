/* eslint-disable react/prop-types */
import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';
import { Card } from 'primereact/card';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

export const CardSettlement = ({ startDate, endDate }) => {
	const [filteredAttendances, setFilteredAttendances] = useState([]);
	const { attendances } = useAttendanceActions();
	const { configState } = useEmployeeActions();

	console.log(configState);
	console.log(startDate, endDate);

	useEffect(() => {
		if (startDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);

			// Crear una función para calcular el número de días en un rango de fechas
			const calculateDays = (start, end) => {
				let days = [];
				for (
					let dt = new Date(start);
					dt <= end;
					dt.setDate(dt.getDate() + 1)
				) {
					days.push(new Date(dt));
				}
				return days;
			};

			const daysInRange = calculateDays(start, end);

			// Filtrar las asistencias dentro del rango de fechas
			const filtered = attendances.filter((attendance) => {
				const attendanceDate = new Date(attendance.date);
				return attendanceDate >= start && attendanceDate <= end;
			});

			// Obtener el valor del presentismo por día
			const valuePresentism = configState[0]?.presentism?.hourlyRate || 0;

			// Crear un mapa para acumular los datos por empleado
			const employeeMap = {};

			// Recorrer las asistencias filtradas y acumular los datos por empleado
			filtered.forEach((attendance) => {
				attendance.employees.forEach((employee) => {
					if (!employeeMap[employee.uid]) {
						employeeMap[employee.uid] = {
							...employee,
							hoursWorked: 0,
							totalHoursValue: 0,
							presentism: 0,
							noAttendance: 0,
							rest: 0,
							travelCostTotal: 0,
							finalSettlement: 0,
						};
					}

					const startTime = new Date(
						`1970-01-01T${employee.startTime}:00Z`
					);
               console.log(startTime)
					const endTime = new Date(`1970-01-01T${employee.endTime}:00Z`);
					const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
					const totalHoursValue = hoursWorked * employee.valuePosition;
               console.log(hoursWorked)
console.log(totalHoursValue)
					// Verificar cada día del rango
					daysInRange.forEach((day) => {
						const isPresent = employee.attendance;
						const isRest = employee.rest;
						const travelCost = employee.valueTravelCost;
						console.log(travelCost);
						if (isPresent || (!isPresent && isRest)) {
							employeeMap[employee.uid].presentism += valuePresentism;
						}

						if (!isPresent) {
							employeeMap[employee.uid].noAttendance += 1; // Cambio de 'inasistencia' a 'noAttendance'
						}

						if (isRest) {
							employeeMap[employee.uid].rest += 1;
						}

						if (travelCost) {
							employeeMap[employee.uid].travelCostTotal += travelCost;
						}
					});
					console.log(hoursWorked);
					employeeMap[employee.uid].hoursWorked += hoursWorked;
					employeeMap[employee.uid].totalHoursValue += totalHoursValue;
					employeeMap[employee.uid].finalSettlement +=
						totalHoursValue +
						employeeMap[employee.uid].presentism +
						employeeMap[employee.uid].travelCostTotal;
				});
			});

			// Convertir el mapa de empleados en un array
			const attendanceWithHours = Object.values(employeeMap);
			setFilteredAttendances(attendanceWithHours);
		}
	}, [startDate, endDate, attendances, configState]);

	console.log(filteredAttendances);

	return (
		<div className='flex items-center flex-wrap'>
			{filteredAttendances?.length > 0 ? (
				filteredAttendances.map(
					(
						employee // Cambio aquí: map directo sobre empleados
					) => (
						<Card
							key={employee.uid}
							className='h-full flex flex-wrap flex-col border-2 border-[#ffd52b] justify-center rounded-xl mx-1 my-3'>
							<div className='flex flex-col flex-wrap flex-grow justify-start ml-1 space-y-1'>
								<div className='flex flex-row text-center items-center gap-1 justify-center h-[20vh] border-b-2 border-[#ffd52b]'>
									<p className='flex flex-col w-2/4 items-center justify-center'>
										Periodo Liquidado
										<span className='font-bold'>
											{startDate} - {endDate}
										</span>
									</p>
									<p className='flex flex-col w-1/4 items-center justify-center'>
										Empleado
										<span className='font-bold'>
											{employee.displayName}
										</span>
									</p>
									<p className='flex flex-col w-1/4 items-center justify-center'>
										Posicion
										<span className='font-bold'>
											{employee.position}
										</span>
									</p>
								</div>
								<div className='flex flex-col items-start justify-start space-y-3 py-3 border-b-2 border-[#ffd52b]'>
									<p className='ml-3'>
										Cantidad de horas liquidadas
										<span className='font-bold'>
											{' '}
											{employee.hoursWorked} horas
										</span>
									</p>
									<p className='ml-3'>
										Total por horas liquidadas
										<span className='font-bold'>
											{' '}
											$ {employee.totalHoursValue}
										</span>
									</p>
									<p className='ml-3'>
										Dias de Inasistencia{' '}
										<span className='font-bold'>
											{employee.noAttendance} dias
										</span>
									</p>
									<p className='ml-3'>
										Presentismo{' '}
										<span className='font-bold'>
											$ {employee.presentism}
										</span>
									</p>
									<p className='ml-3'>
										Viaticos{' '}
										<span className='font-bold'>
											$ {employee.travelCostTotal}
										</span>
									</p>
									<p className='ml-3'>
										Adelantos/Prestamos {''}
										<span className='font-bold'>
											${/* Si aplica */}
										</span>
									</p>
								</div>
								<div className='flex flex-row flex-wrap items-center justify-center font-bold text-xl'>
									<p className='mt-3 flex flex-row items-center justify-around mx-5'>
										Total $ {employee.finalSettlement}
									</p>
								</div>
							</div>
							<div className='flex flex-row flex-wrap items-center justify-around my-3'>
								<Button className='hover:bg-slate-300 focus:shadow-outline focus:outline-none text-black p-2 rounded'>
									<i className='pi pi-eye mr-2 font-semibold text-xl text-blue-500'></i>{' '}
									Ver
								</Button>
								<Button className='hover:bg-slate-300 focus:shadow-outline focus:outline-none text-black p-2 rounded'>
									<i className='pi pi-print text-xl mr-2 font-semibold text-green-500'></i>{' '}
									Imprimir
								</Button>
							</div>
						</Card>
					)
				)
			) : (
				<div className='h-[40vh] w-full flex items-center justify-center text-center'>
					<p className='text-2xl font-bold'>
						No tienes asistencias registradas en el periodo seleccionado
					</p>
				</div>
			)}
		</div>
	);
};
