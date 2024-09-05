import { useState } from 'react';
// import { Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { v4 as uuidv4 } from 'uuid';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const AccordionPrices = () => {
	const [selectedItems, setSelectedItems] = useState({});
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [categories, setCategories] = useState([
		{
			id: uuidv4(),
			title: 'Introduce el nombre del rubro',
			content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
			subcategories: [],
		},
	]);
	const getCategoryNumber = (categoryId) => {
		const index = categories.findIndex((cat) => cat.id === categoryId) + 1;
		return index.toString();
	};
	const getSubcategoryNumber = (categoryId, subcategoryId) => {
		const category = categories.find((cat) => cat.id === categoryId);
		const index =
			category.subcategories.findIndex(
				(subcat) => subcat.id === subcategoryId
			) + 1;
		return `${getCategoryNumber(categoryId)}.${index}`;
	};
	const addCategory = () => {
		const newCategory = {
			id: uuidv4(),
			title: `Introduce el nombre del rubro`,
			content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
			subcategories: [],
		};
		setCategories([...categories, newCategory]);
	};
	const addSubcategory = (categoryId) => {
		const newSubcategory = {
			id: uuidv4(),
			title: `Introduce el nombre del subrubro`,
			content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
		};
		setCategories((prevCategories) =>
			prevCategories.map((cat) =>
				cat.id === categoryId
					? {
							...cat,
							subcategories: [...cat.subcategories, newSubcategory],
					  }
					: cat
			)
		);
	};
	const handleDelete = (type, id) => {
		if (type === 'category') {
			setCategories(categories.filter((cat) => cat.id !== id));
			setShowConfirmDialog(false);
		} else if (type === 'subcategory') {
			setCategories(
				categories.map((cat) => ({
					...cat,
					subcategories: cat.subcategories.filter(
						(subcat) => subcat.id !== id
					),
				}))
			);
			setShowConfirmDialog(false);
		}
	};

	const footerContent = (
		<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
			<Button
				label='No'
				icon='pi pi-times text-red-500 font-bold mr-2'
				onClick={() => setShowConfirmDialog(false)}
				className='p-button-text hover:bg-red-100 p-2 rounded-md'
			/>
			<Button
				label='Sí'
				icon='pi pi-check text-green-500 font-bold mr-2'
				onClick={handleDelete}
				className='p-button-text hover:bg-green-200 p-2 rounded-md'
			/>
		</div>
	);

	const handleCheckboxChange = (type, id) => {
		if (type === 'category') {
			const category = categories.find((cat) => cat.id === id);
			const isChecked = !selectedItems[`${type}-${id}`];
			setSelectedItems((prevSelectedItems) => {
				const updatedSelectedItems = {
					...prevSelectedItems,
					[`${type}-${id}`]: isChecked,
				};
				// Actualizar el estado de los subrubros
				if (category.subcategories.length > 0) {
					category.subcategories.forEach((subcat) => {
						updatedSelectedItems[`${'subcategory'}-${subcat.id}`] =
							isChecked;
					});
				}
				return updatedSelectedItems;
			});
		} else if (type === 'subcategory') {
			setSelectedItems((prevSelectedItems) => ({
				...prevSelectedItems,
				[`${type}-${id}`]: !prevSelectedItems[`${type}-${id}`],
			}));
		}
	};
	const isSelected = (type, id) => !!selectedItems[`${type}-${id}`];

	const handleTitleChange = (type, id, newTitle) => {
		if (type === 'category') {
			setCategories((prevCategories) =>
				prevCategories.map((cat) =>
					cat.id === id ? { ...cat, title: newTitle } : cat
				)
			);
		} else if (type === 'subcategory') {
			setCategories((prevCategories) =>
				prevCategories.map((cat) => ({
					...cat,
					subcategories: cat.subcategories.map((subcat) =>
						subcat.id === id ? { ...subcat, title: newTitle } : subcat
					),
				}))
			);
		}
	};

	return (
		<>
			<div>
				<Accordion defaultActiveKey='0' className='space-y-2'>
					{categories.map((category) => (
						<Accordion.Item
							eventKey={category.id}
							key={category.id}
							className='custom-accordion'>
							<Accordion.Header className='w-full flex flex-row items-center justify-between mx-2 px-2'>
								<div className='w-full flex flex-row flex-wrap items-center justify-between'>
									<div className='flex flex-row items-center justify-start'>
										<input
											type='checkbox'
											checked={isSelected('category', category.id)}
											onChange={() =>
												handleCheckboxChange(
													'category',
													category.id
												)
											}
											className='ml-2 rounded-md size-4 '
										/>
										<input
											className='ml-2 p-2 w-[40px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
											type='text'
											value={`${getCategoryNumber(category.id)} `}
											onClick={(e) => e.stopPropagation()}
											readOnly
										/>
										<input
											className='p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
											type='text'
											value={category.title}
											onClick={(e) => e.stopPropagation()}
											onChange={(e) =>
												handleTitleChange(
													'category',
													category.id,
													e.target.value
												)
											}
											onBlur={(e) =>
												handleTitleChange(
													'category',
													category.id,
													e.target.value
												)
											}
										/>
									</div>
									<Button
										type='button'
										className='bg-transparent btnicon border-none flex items-end text-black'
										onClick={(e) => {
											e.stopPropagation();
											setShowConfirmDialog(true);
											// handleDelete('category', category.id);
										}}>
										<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
									</Button>
								</div>
							</Accordion.Header>
							<Accordion.Body className='flex flex-col flex-wrap items-start space-y-3'>
								{category.content}
								<div className='flex flex-col flex-wrap items-start justify-center gap-3'>
									<button className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
										<i className='pi pi-plus text-xs font-semibold mr-2'></i>
										Nuevo Item de Rubro
									</button>
									<button
										className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'
										onClick={() => addSubcategory(category.id)}>
										<i className='pi pi-plus text-xs font-semibold mr-2'></i>
										Nuevo SubRubro
									</button>
								</div>

								<Accordion className='w-full'>
									{category.subcategories.map((subcategory) => (
										<Accordion.Item
											eventKey={subcategory.id}
											key={subcategory.id}
											className='custom-accordion border-none'>
											<Accordion.Header className='w-full flex flex-row items-center justify-between mx-2 px-2'>
												<div className='w-full flex flex-row flex-wrap items-center justify-between'>
													<div className='flex flex-row items-center justify-center'>
														<input
															type='checkbox'
															checked={isSelected(
																'subcategory',
																subcategory.id
															)}
															onChange={() =>
																handleCheckboxChange(
																	'subcategory',
																	subcategory.id
																)
															}
															className='ml-2 rounded-md size-4'
														/>
														<input
															className='ml-2 p-2 w-[45px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
															type='text'
															value={`${getSubcategoryNumber(
																category.id,
																subcategory.id
															)} `}
															onClick={(e) =>
																e.stopPropagation()
															}
															readOnly
														/>
														<input
															className='p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
															type='text'
															value={subcategory.title}
															onClick={(e) =>
																e.stopPropagation()
															}
															onChange={(e) =>
																handleTitleChange(
																	'subcategory',
																	subcategory.id,
																	e.target.value
																)
															}
															onBlur={(e) =>
																handleTitleChange(
																	'subcategory',
																	subcategory.id,
																	e.target.value
																)
															}
														/>
													</div>
													<Button
														type='button'
														className='bg-transparent border-none flex items-end text-black'
														onClick={(e) => {
															e.stopPropagation();
															setShowConfirmDialog(true);

															// handleDelete(
															// 	'subcategory',
															// 	subcategory.id
															// );
														}}>
														<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
													</Button>
												</div>
											</Accordion.Header>
											<Accordion.Body>
												{subcategory.content}
												<button className='mt-3 flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
													<i className='pi pi-plus text-xs font-semibold mr-2'></i>
													Nuevo Item de SubRubro
												</button>
											</Accordion.Body>
										</Accordion.Item>
									))}
								</Accordion>
							</Accordion.Body>
						</Accordion.Item>
					))}
				</Accordion>
			</div>
			<div className='m-2'>
				<button className='btnprimary' onClick={addCategory}>
					<i className='pi pi-plus mr-2'></i>Crear Nuevo Rubro
				</button>
			</div>
			<Dialog
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				header='Confirmar Eliminación'
				footer={footerContent}>
				<p>¿Estás seguro de que quieres eliminar el adelanto/prestamo?</p>
			</Dialog>
		</>
	);
};
export default AccordionPrices;
