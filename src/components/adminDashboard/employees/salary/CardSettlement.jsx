import { useAttendanceActions } from '../../../../hooks/useAttendanceActions';
import { Card } from 'primereact/card';
import { useEmployeeActions } from '../../../../hooks/useEmployeeActions';
import { Button } from 'primereact/button';

export const CardSettlement = ({ startDate, endDate }) => {
	const { attendances } = useAttendanceActions();
	const { employees } = useEmployeeActions();

	return (
		<div className='flex items-center flex-wrap'>
			{attendances.length > 0 ? (
				attendances.map((attendance) => (
					<Card
						key={attendance.employees.uid}
						className=' h-full flex flex-wrap flex-col border-2 border-[#ffd52b] justify-center rounded-xl mx-3 my-3'>
						<div className='flex flex-col flex-wrap flex-grow justify-start ml-3 space-y-2'>
							<div className='flex flex-row items-center gap-3 justify-center h-[20vh]'>
								<p className='flex flex-col items-center justify-center'>
									Periodo de Liquidacion
									<span className='font-bold'>24/08/2024 - 30/08/2024{/* <date>{startDate} - {endDate}</date> */}</span>
								</p>
								<p className='flex flex-col items-center justify-center'>
									Empleado
									<span className='font-bold'>
										{' '}
										Fabrizio Colombo{attendance.employees.displayName}
									</span>
								</p>
								<p className='flex flex-col items-center justify-center'>
									{' '}
									Posicion
									<span className='font-bold'> Capataz{attendance.position}</span>
								</p>
							</div>
							<div className='flex flex-col items-starte justify-start gap-3'>
								<p>
									Cantidad de horas liquidadas{' '}
									<span> 75 {attendance.domicilio}</span>
								</p>
								<p>
									Dias de Inasistencia{' '}
									<span> 3 {attendance.domicilio}</span>
								</p>
								<p>
									Presentismo $ 850<span>{attendance.domicilio}</span>
								</p>
								<p>
									Viaticos $ 850<span>{attendance.domicilio}</span>
								</p>
								<p>
									Adelantos/Prestamos $ 850
									<span>{attendance.domicilio}</span>
								</p>
							</div>
							<div className='flex flex-row flex-wrap items-center justify-center'>
								<p className='mt-3 flex flex-row items-center justify-around mx-5'>
									Total $ 15000 <span>{attendance.domicilio}</span>
								</p>
							</div>
						</div>
						<div className='flex flex-row flex-wrap items-center justify-around my-3'>
							<Button>
								<i className='pi pi-eye mr-2 font-semibold'></i> Ver
							</Button>
							<Button>
								<i className='pi pi-print mr-2 font-semibold'></i>{' '}
								Imprimir
							</Button>
						</div>
					</Card>
				))
			) : (
				<div className='h-[40vh] flex items-center justify-center'>
					<p className='text-3xl font-bold'>
						No tienes asistencias registradas actualmente
					</p>
				</div>
			)}
		</div>
	);
};
