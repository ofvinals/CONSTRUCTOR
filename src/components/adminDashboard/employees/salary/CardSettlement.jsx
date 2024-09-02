/* eslint-disable react/prop-types */
import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';
import { Card } from 'primereact/card';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import PaginatorComponent from '../../../../utils/Paginator';
import { useLoanActions } from '../../../../hooks/useLoanActions';

export const CardSettlement = ({ startDate, endDate }) => {
	const [filteredAttendances, setFilteredAttendances] = useState([]);
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const { attendances } = useAttendanceActions();
	const { configState } = useEmployeeActions();
	const { loans } = useLoanActions();
	console.log(loans);
	useEffect(() => {
		if (startDate && endDate) {
			// Convertir startDate y endDate a cadenas de fecha en formato YYYY-MM-DD
			const start = new Date(startDate);
			const end = new Date(endDate);
			const startDateString = start.toISOString().split('T')[0];
			const endDateString = end.toISOString().split('T')[0];

			// Filtrar las asistencias que estén dentro del rango de fechas
			const filteredAttendances = attendances.filter((attendance) => {
				// Convertir la fecha de la asistencia a formato YYYY-MM-DD
				const attendanceDateString = new Date(attendance.date)
					.toISOString()
					.split('T')[0];
				return (
					attendanceDateString >= startDateString &&
					attendanceDateString <= endDateString
				);
			});

			const valuePresentism = configState[0]?.presentism?.hourlyRate || 0;

			// Inicializar el mapa para acumular datos por empleado
			const employeeMap = {};
			// Recorrer las asistencias filtradas
			filteredAttendances.forEach((attendance) => {
				attendance.employees.forEach((employee) => {
					// Si el empleado no existe en el mapa, inicializar sus datos
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
					// Convertir los horarios de entrada y salida en objetos Date
					const startTime = employee.startTime
						? new Date(`1970-01-01T${employee.startTime}:00Z`)
						: null;
					const endTime = employee.endTime
						? new Date(`1970-01-01T${employee.endTime}:00Z`)
						: null;

					// Calcular las horas trabajadas para este día
					let hoursWorked = 0;
					if (startTime && endTime) {
						// Ajustar endTime si es menor que startTime (indicativo de que cruzó medianoche)
						if (endTime < startTime) {
							endTime.setDate(endTime.getDate() + 1);
						}

						hoursWorked = (endTime - startTime) / (1000 * 60 * 60);

						// Si el rango horario abarca las 12 PM, restar una hora
						if (startTime.getHours() < 12 && endTime.getHours() >= 12) {
							hoursWorked -= 1;
						}
					}

					const totalHoursValue = hoursWorked * employee.valuePosition;
					// Actualizar los datos del empleado en el mapa
					if (employee.attendance) {
						employeeMap[employee.uid].hoursWorked += hoursWorked;
						employeeMap[employee.uid].totalHoursValue += totalHoursValue;
					} else {
						employeeMap[employee.uid].noAttendance += 1;
					}
					if (employee.rest) {
						employeeMap[employee.uid].rest += 1;
					}
					if (employeeMap[employee.uid].noAttendance > 0) {
						null;
					} else if (employee.attendance || employee.rest) {
						employeeMap[employee.uid].presentism += valuePresentism;
					}
					if (employee.valueTravelCost) {
						employeeMap[employee.uid].travelCostTotal +=
							employee.valueTravelCost;
					}
					// Cálculo del total de la liquidación final
					employeeMap[employee.uid].finalSettlement =
						employeeMap[employee.uid].totalHoursValue +
						employeeMap[employee.uid].presentism +
						employeeMap[employee.uid].travelCostTotal;
				});
			});
			// Convertir el mapa de empleados en un array y actualizar el estado
			setFilteredAttendances(Object.values(employeeMap));
		}
	}, [startDate, endDate, attendances, configState]);

	// Calcular la suma total de todas las liquidaciones finales
	const totalFinalSettlement = filteredAttendances.reduce(
		(acc, employee) => acc + employee.finalSettlement,
		0
	);

	const onPageChange = (event) => {
		setFirst(event.first);
		setRows(event.rows);
	};

	const paginatedEmployees = filteredAttendances.slice(first, first + rows);

	return (
		<div>
			<div className='flex items-center flex-col justify-center flex-wrap'>
				{paginatedEmployees?.length > 0 ? (
					<>
						<div className='flex flex-wrap flex-row items-center justify-center'>
							<h2 className='text-xl font-semibold'>
								Suma total por el periodo seleccionado
							</h2>
							<span className='text-2xl font-bold ml-3'>
								${totalFinalSettlement}
							</span>
						</div>
						<div className='flex flex-row flex-wrap items-center justify-around'>
							{paginatedEmployees.map((employee) => (
								<Card
									key={employee.uid}
									className='h-full flex w-[320px] flex-wrap flex-row items-center border-2 border-[#ffd52b] justify-center rounded-xl mx-2 my-3'>
									<div className='flex flex-col flex-wrap justify-start'>
										<div className='flex flex-row text-center items-center gap-1 justify-center h-[15vh] border-b-2 border-[#ffd52b]'>
											<p className='flex flex-col w-2/4 items-center justify-center'>
												Periodo
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
												Cantidad de horas
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
												Adelantos/Prestamos{' '}
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
										<Button className='hover:bg-slate-300 focus:shadow-none text-black p-2 rounded'>
											<i className='pi pi-print text-xl mr-2 font-semibold text-green-500'></i>{' '}
											Imprimir
										</Button>
									</div>
								</Card>
							))}
						</div>
					</>
				) : (
					<div className='h-[40vh] w-full flex items-center justify-center text-center'>
						<p className='text-2xl font-bold'>
							No tienes asistencias registradas en el periodo
							seleccionado
						</p>
					</div>
				)}
			</div>

			<PaginatorComponent
				first={first}
				rows={rows}
				totalRecords={filteredAttendances.length}
				onPageChange={onPageChange}
			/>
		</div>
	);
};
