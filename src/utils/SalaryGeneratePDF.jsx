/* eslint-disable react/prop-types */
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { format } from 'date-fns';

// Cargar fuentes
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const SalaryGeneratePDF = ({ employees, startDate, endDate }) => {
	const formattedStartDate = startDate ? format(startDate, 'dd/MM/yyyy') : '';
	const formattedEndDate = endDate ? format(endDate, 'dd/MM/yyyy') : '';
	const handleDownloadPDF = () => {
		const docDefinition = {
			content: employees.flatMap((employee) => [
				{
					table: {
						widths: ['*', '*'],
						body: [
							[
								{
									text: 'Recibo de Sueldo',
									style: 'header',
									colSpan: 2,
								},
								{},
							],
							[
								{ text: 'Periodo:', style: 'label' },
								{
									text: `${formattedStartDate} - ${formattedEndDate}`,
									style: 'value',
								},
							],
							[
								{ text: 'Empleado:', style: 'label' },
								{ text: employee.displayName, style: 'value' },
							],
							[
								{ text: 'Posición:', style: 'label' },
								{ text: employee.position, style: 'value' },
							],
						],
					},
					layout: 'lightHorizontalLines',
					margin: [0, 10, 0, 20],
				},
				{
					table: {
						widths: ['*', '*'],
						body: [
							[
								{ text: 'Horas Trabajadas:', style: 'label' },
								{
									text: `${employee.hoursWorked} horas`,
									style: 'value',
								},
							],
							[
								{ text: 'Total por Horas:', style: 'label' },
								{
									text: `$ ${employee.totalHoursValue}`,
									style: 'value',
								},
							],
							[
								{ text: 'Días de Inasistencia:', style: 'label' },
								{
									text: `${employee.noAttendance} días`,
									style: 'value',
								},
							],
							[
								{ text: 'Presentismo:', style: 'label' },
								{ text: `$ ${employee.presentism}`, style: 'value' },
							],
							[
								{ text: 'Viáticos:', style: 'label' },
								{
									text: `$ ${employee.travelCostTotal}`,
									style: 'value',
								},
							],
							[
								{ text: 'Adelantos/Préstamos:', style: 'label' },
								{
									text: `-$ ${employee.loans.reduce(
										(total, loan) =>
											total + parseFloat(loan.valueLoan),
										0
									)}`,
									style: 'value',
								},
							],
						],
					},
					layout: 'lightHorizontalLines',
					margin: [0, 0, 0, 20],
				},
				{
					text: `Total a cobrar: $ ${employee.finalSettlement}`,
					style: 'total',
					margin: [0, 0, 0, 20],
				},
				{
					text: '------------------------------------------------------------',
					style: 'divider',
					margin: [0, 0, 0, 20],
				},
				{ text: '', pageBreak: 'after' },
			]),
			styles: {
				header: {
					fontSize: 16,
					bold: true,
					alignment: 'center',
					margin: [0, 10, 0, 10],
				},
				label: { fontSize: 12, bold: true, margin: [0, 5] },
				value: { fontSize: 12, margin: [0, 5] },
				total: { fontSize: 14, bold: true, alignment: 'right' },
				footer: {
					fontSize: 14,
					bold: true,
					margin: [0, 5, 0, 0],
					alignment: 'right',
				},
				divider: { fontSize: 10, alignment: 'center', color: 'grey' },
			},
			defaultStyle: {
				fontSize: 12,
				alignment: 'left',
				lineHeight: 1.5,
			},
		};

		pdfMake.createPdf(docDefinition).open();
		pdfMake.createPdf(docDefinition).download('recibos.pdf');
	};

	return (
		<button
			onClick={handleDownloadPDF}
			className='btnprimary  text-center ml-5 '>
			<i className='pi pi-print mr-2 text-xl'></i>
			Descargar PDF
		</button>
	);
};
