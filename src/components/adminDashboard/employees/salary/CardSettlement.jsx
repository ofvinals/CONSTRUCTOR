/* eslint-disable react-hooks/exhaustive-deps */
import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';
import { Card } from 'primereact/card';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { useEffect, useState } from 'react';
import PaginatorComponent from '../../../../utils/Paginator';
import { useLoanActions } from '../../../../hooks/useLoanActions';
import PropTypes from 'prop-types';

export const CardSettlement = ({ startDate, endDate, setEmployeeData }) => {
	const [filteredAttendances, setFilteredAttendances] = useState([]);
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const { attendances } = useAttendanceActions();
	const { configState } = useEmployeeActions();
	const { loans } = useLoanActions();

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
							loans: [],
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
			// Filtrar los vencimientos de préstamos y adelantos que estén dentro del rango de fechas
			const filteredLoans = loans.filter((loan) => {
				// Manejar préstamos con fechas de vencimiento en dueDates
				if (loan.values.dueDates && loan.values.dueDates.length > 0) {
					return loan.values.dueDates.some((date) => {
						const dueDate = new Date(date);
						return dueDate >= start && dueDate <= end;
					});
				}
				// Manejar adelantos con fecha de vencimiento en quoteDateLoan
				if (loan.values.quoteDateLoan) {
					const dueDate = new Date(loan.values.quoteDateLoan);
					return dueDate >= start && dueDate <= end;
				}
				return false;
			});
			// Añadir los préstamos al mapa de empleados
			filteredLoans.forEach((loan) => {
				const employeeId = loan.values.employeeId;
				if (employeeMap[employeeId]) {
					employeeMap[employeeId].loans.push({
						quoteDateLoan: loan.values.quoteDateLoan,
						valueLoan: loan.values.valueLoan,
						typeLoan: loan.values.typeLoan,
					});
				}
			});
			// Restar el total de préstamos de la liquidación final de cada empleado
			Object.values(employeeMap).forEach((employee) => {
				const totalLoans = employee.loans.reduce(
					(total, loan) => total + parseFloat(loan.valueLoan),
					0
				);
				employee.finalSettlement -= totalLoans; // Restar los préstamos del total final
			});
			// Convertir el mapa de empleados en un array y actualizar el estado
			const employeesArray = Object.values(employeeMap);
			setFilteredAttendances(employeesArray);
			setEmployeeData(employeesArray);
		}
	}, [startDate, endDate, attendances, configState]);
	// Calcular la suma total de todas las liquidaciones finales
	const totalFinalSettlement = filteredAttendances.reduce(
		(acc, employee) => acc + employee.finalSettlement,
		0
	);
	const formatNumber = (value) => {
		const number = Number(value);
		return number.toLocaleString('es-AR');
	};
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
						<div className='flex flex-wrap flex-row items-center rounded-md justify-center border-2 border-[#ffd52b] p-2'>
							<h2 className='text-lg font-semibold'>
								Total por Periodo Seleccionado
							</h2>
							<span className='text-2xl font-bold ml-3'>
								$ {formatNumber(totalFinalSettlement)}
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
													${' '}
													{formatNumber(employee.totalHoursValue)}
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
													$ {formatNumber(employee.presentism)}
												</span>
											</p>
											<p className='ml-3'>
												Viaticos{' '}
												<span className='font-bold'>
													${' '}
													{formatNumber(employee.travelCostTotal)}
												</span>
											</p>
											<p className='ml-3'>
												Adelantos/Prestamos{' '}
												<span className='font-bold'>
													-${' '}
													{formatNumber(
														employee.loans.reduce(
															(total, loan) =>
																total +
																parseFloat(loan.valueLoan),
															0
														)
													)}
												</span>
											</p>
										</div>
										<div className='flex flex-row flex-wrap items-center justify-center font-bold text-xl'>
											<p className='mt-3 flex flex-row items-center justify-around mx-5 mb-3'>
												Total ${' '}
												{formatNumber(employee.finalSettlement)}
											</p>
										</div>
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
CardSettlement.propTypes = {
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
	setEmployeeData: PropTypes.func.isRequired,
};
