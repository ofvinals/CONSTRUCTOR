import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useBudgetDetailsActions } from '../hooks/useBudgetDetailsActions';

// Asignar fuentes virtuales a pdfMake
pdfMake.vfs = {
	...pdfFonts.pdfMake.vfs, // Incluye las fuentes por defecto
};

export const BudgetGeneratePDF = () => {
	const { categories } = useBudgetDetailsActions();

	const sanitizeValue = (value) =>
		value !== undefined && value !== null ? value : 'No disponible';

	const formatCategories = (categories) => {
		return categories.flatMap((category) => [
			{
				text: `Rubro: ${sanitizeValue(category.title)}`,
				style: 'header',
				margin: [0, 10],
			},
			{
				table: {
					widths: ['*', '*', '*', '*', '*'],
					body: [
						[
							{ text: 'Descripción', style: 'tableHeader' },
							{ text: 'Cantidad', style: 'tableHeader' },
							{ text: 'Unidad', style: 'tableHeader' },
							{ text: 'Precio Unitario', style: 'tableHeader' },
							{ text: 'Precio Total', style: 'tableHeader' },
						],
						...category.items.map((item) => [
							{
								text: sanitizeValue(item.shortDescription),
								alignment: 'center',
							},
							{
								text: sanitizeValue(item.measurement),
								alignment: 'center',
							},
							{
								text: sanitizeValue(item.unitType),
								alignment: 'center',
							},
							{
								text: item.unitPrice
									? `$ ${parseFloat(item.unitPrice).toFixed(2)}`
									: 'No disponible',
								alignment: 'center',
							},
							{
								text: item.finalPrice
									? `$ ${parseFloat(item.finalPrice).toFixed(2)}`
									: 'No disponible',
								alignment: 'center',
							},
						]),
						...category.subcategories.flatMap((subcategory) => [
							[
								{
									text: `Subrubro: ${sanitizeValue(
										subcategory.title
									)}`,
									colSpan: 5,
									style: 'subHeader',
									margin: [0, 10],
								},
								{},
								{},
								{},
								{},
							],
							...subcategory.items.map((item) => [
								{
									text: sanitizeValue(item.shortDescription),
									alignment: 'center',
								},
								{
									text: sanitizeValue(item.measurement),
									alignment: 'center',
								},
								{
									text: sanitizeValue(item.unitType),
									alignment: 'center',
								},
								{
									text: item.unitPrice
										? `$ ${parseFloat(item.unitPrice).toFixed(2)}`
										: 'No disponible',
									alignment: 'center',
								},
								{
									text: item.finalPrice
										? `$ ${parseFloat(item.finalPrice).toFixed(2)}`
										: 'No disponible',
									alignment: 'center',
								},
							]),
						]),
					],
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 20],
			},
			{
				text: '------------------------------------------------------------',
				style: 'divider',
				margin: [0, 10],
			},
		]);
	};

	const handleDownloadPDF = () => {
		const totalPrice = categories.reduce(
			(total, category) =>
				total +
				category.items.reduce(
					(sum, item) => sum + parseFloat(item.finalPrice || 0),
					0
				) +
				category.subcategories.reduce(
					(sum, subcategory) =>
						sum +
						subcategory.items.reduce(
							(itemSum, item) =>
								itemSum + parseFloat(item.finalPrice || 0),
							0
						),
					0
				),
			0
		);

		const configValues = {
			benefits: 15, // Replace with actual value
			anteproyectFee: 10, // Replace with actual value
			proyectFee: 20, // Replace with actual value
			dtFee: 5, // Replace with actual value
			adminFee: 7, // Replace with actual value
		};

		const anteproyectFeeAmount =
			totalPrice * (configValues.anteproyectFee / 100);
		const proyectFeeAmount = totalPrice * (configValues.proyectFee / 100);
		const dtFeeAmount = totalPrice * (configValues.dtFee / 100);
		const adminFeeAmount = totalPrice * (configValues.adminFee / 100);
		const totalFees =
			anteproyectFeeAmount + proyectFeeAmount + dtFeeAmount + adminFeeAmount;
		const totalBudget = totalPrice + totalFees;

		const docDefinition = {
			content: [
				{
					text: 'Presupuesto de Construcción',
					style: 'title',
					margin: [0, 0, 0, 20],
				},
				...formatCategories(categories),
				{
					text: '------------------------------------------------------------',
					style: 'divider',
					margin: [0, 10],
				},
				{
					text: 'Resumen de Honorarios y Total Presupuesto',
					style: 'sectionTitle',
					margin: [0, 20],
				},
				{
					table: {
						widths: ['*', '*'],
						body: [
							[
								{
									text: 'Costo Real',
									style: 'sectionTitle',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: `$ ${totalPrice.toFixed(2)}`,
									style: 'sectionValue',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: 'Margen Beneficio',
									style: 'sectionTitle',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: `${configValues.benefits} %`,
									style: 'sectionValue',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: 'Honorarios',
									style: 'sectionTitle',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: 'AnteProyecto',
									style: 'feeHeader',
									alignment: 'center',
								},
								{
									text: `$ ${anteproyectFeeAmount.toFixed(2)}`,
									style: 'feeValue',
									alignment: 'center',
								},
							],
							[
								{
									text: 'Proyecto',
									style: 'feeHeader',
									alignment: 'center',
								},
								{
									text: `$ ${proyectFeeAmount.toFixed(2)}`,
									style: 'feeValue',
									alignment: 'center',
								},
							],
							[
								{
									text: 'D. T.',
									style: 'feeHeader',
									alignment: 'center',
								},
								{
									text: `$ ${dtFeeAmount.toFixed(2)}`,
									style: 'feeValue',
									alignment: 'center',
								},
							],
							[
								{
									text: 'Administración',
									style: 'feeHeader',
									alignment: 'center',
								},
								{
									text: `$ ${adminFeeAmount.toFixed(2)}`,
									style: 'feeValue',
									alignment: 'center',
								},
							],
							[
								{
									text: 'Total Presupuesto',
									style: 'sectionTitle',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
							[
								{
									text: `$ ${totalBudget.toFixed(2)}`,
									style: 'sectionValue',
									colSpan: 2,
									alignment: 'center',
								},
								{},
							],
						],
					},
					layout: 'lightHorizontalLines',
					margin: [0, 20],
				},
			],
			styles: {
				title: {
					fontSize: 18,
					bold: true,
					alignment: 'center',
					margin: [0, 20, 0, 10],
				},
				header: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5],
				},
				subHeader: {
					fontSize: 14,
					bold: true,
					margin: [0, 10, 0, 5],
				},
				tableHeader: {
					fontSize: 12,
					bold: true,
					alignment: 'center',
					fillColor: '#f0f0f0',
				},
				total: {
					fontSize: 16,
					bold: true,
					alignment: 'right',
					margin: [0, 20],
				},
				divider: {
					fontSize: 10,
					alignment: 'center',
					color: 'grey',
				},
				sectionTitle: {
					fontSize: 14,
					bold: true,
					alignment: 'center',
					margin: [0, 5],
				},
				sectionValue: {
					fontSize: 14,
					alignment: 'center',
				},
				feeHeader: {
					fontSize: 14,
					bold: true,
					alignment: 'center',
				},
				feeValue: {
					fontSize: 14,
					alignment: 'center',
				},
			},
			defaultStyle: {
				fontSize: 12,
				alignment: 'left',
				lineHeight: 1.5,
			},
		};

		// Verificar que la definición del documento está correcta
		console.log('Document Definition:', docDefinition);

		pdfMake.createPdf(docDefinition).open();
	};

	return (
		<button
			onClick={handleDownloadPDF}
			className='btnprimary text-center ml-5'>
			<i className='pi pi-print mr-2'></i>
			Descargar PDF
		</button>
	);
};

export default BudgetGeneratePDF;
