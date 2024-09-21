import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const handleExportToExcel = ({ categories, selectedItems }) => {
	try {
		const data = [];
		// Iterar sobre cada categoría
		Object.values(categories).forEach((category) => {
			const categoryId = category.uid;
			// Verificar items seleccionados en la categoría
			if (selectedItems.categories[categoryId]) {
				const itemIds = selectedItems.categories[categoryId].items || [];
				console.log(
					`Items seleccionados en categoría ${category.title}:`,
					itemIds
				);
				itemIds.forEach((itemId) => {
					const item = category.items.find((item) => item.uid === itemId);
					if (item) {
						data.push({
							Categoría: category.title,
							SubCategoria: null,
							Descripción: item.shortDescription,
							Precio: item.finalPrice,
							Unidad: item.unitType,
						});
					}
				});
			}

			// Iterar sobre las subcategorías
			Object.keys(
				selectedItems.categories[categoryId]?.subcategories || {}
			).forEach((subcategoryId) => {
				const subcategoryData =
					selectedItems.categories[categoryId].subcategories[
						subcategoryId
					];
				const subItemIds = subcategoryData.items || [];
				// Iterar sobre los items de la subcategoría
				subItemIds.forEach((subItemId) => {
					const subcategory = category.subcategories.find(
						(sub) => sub.uid === subcategoryId
					);
					if (subcategory) {
						const subItem = subcategory.items.find(
							(item) => item.uid === subItemId
						);
						if (subItem) {
							data.push({
								Categoría: category.title,
								SubCategoria: subcategory.title,
								Descripción: subItem.shortDescription,
								Precio: subItem.finalPrice,
								Unidad: subItem.unitType,
							});
						}
					}
				});
			});
		});

		// Crear un libro de trabajo de Excel
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
		// Exportar el archivo
		const excelBlob = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'binary',
		});
		const blob = new Blob([s2ab(excelBlob)], {
			type: 'application/octet-stream',
		});
		saveAs(blob, 'datos-exportados.xlsx');
	} catch (error) {
		console.error('Error al exportar a Excel:', error);
	}
};

// Función auxiliar para convertir string a ArrayBuffer
const s2ab = (s) => {
	const buf = new ArrayBuffer(s.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xff;
	}
	return buf;
};
