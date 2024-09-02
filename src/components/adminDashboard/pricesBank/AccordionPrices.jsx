import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';

export const AccordionPrices = () => {
	const [categorys, setCategorys] = useState([
		{
			id: '0',
			title: 'Introduce el nombre de la categoria',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		},
	]);
	const [subcategorys, setSubcategorys] = useState([
		{
			id: '0',
			title: 'Introduce el nombre de la subcategoria',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		},
	]);

	const addCategory = () => {
		const newId = categorys.length.toString();
		const newCategory = {
			id: newId,
			title: `Introduce el nombre de la categoria`,
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		};
		setCategorys([...categorys, newCategory]);
	};

	const handleDelete = (type, index) => {
		if (type === 'category') {
			setCategorys(categorys.filter((_, i) => i !== index));
		} else if (type === 'subcategory') {
			setSubcategorys(subcategorys.filter((_, i) => i !== index));
		}
	};

	return (
		<>
			<div>
				<Accordion defaultActiveKey='0' className='space-y-2 '>
					{categorys.map((category) => (
						<Accordion.Item
							eventKey={category.id}
							key={category.id}
							className='custom-accordion'>
							<Accordion.Header className='w-full flex flex-row items-center justify-between mx-2  px-2'>
								<div className='w-full  flex flex-row flex-wrap items-center justify-between'>
									<input
										className='ml-5  p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
										type='text'
										value={category.title}
										// onChange={handleLabelChange}
										// onBlur={handleBlur}
										onClick={(e) => e.stopPropagation()}
									/>
									<Button
										type='button'
										className='bg-transparent border-none flex items-end text-black '
										onClick={(e) => {
											e.stopPropagation();
											handleDelete('category', category.id);
										}}>
										<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-xl'></i>
									</Button>
								</div>
							</Accordion.Header>
							<Accordion.Body className='flex flex-col flex-wrap items-start space-y-3'>
								<button className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
									<i className='pi pi-plus text-xs font-semibold mr-2'></i>
									Nueva Subcategoria
								</button>
								<button className='flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
									{' '}
									<i className='pi pi-plus text-xs font-semibold mr-2'></i>
									Nuevo Item
								</button>
							</Accordion.Body>
						</Accordion.Item>
					))}
				</Accordion>
			</div>
			<div className='m-2'>
				<button className='btnprimary' onClick={addCategory}>
					<i className='pi pi-plus mr-2'></i>Crear Nueva Categoria
				</button>
			</div>
		</>
	);
};

export default AccordionPrices;
