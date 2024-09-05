/* eslint-disable react/prop-types */
import { Button, Accordion } from 'react-bootstrap';
import SubcategoryItem from './SubCategoryItem';
import { useState } from 'react';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';

const CategoryItem = ({
	category,
	subcategories,
	onAddSubcategory,
	onDelete,
	onTitleChange,
	isSelected,
	handleCheckboxChange,
	getCategoryNumber,
	getSubcategoryNumber,
	onClick,
}) => {
	const [title, setTitle] = useState(category.title);
	const { categoryStatusUpdate, categoryStatusDelete } = usePriceActions();
	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== category.title) {
			onTitleChange('rubro', category.uid, newTitle);
		} else return;
	};

	return (
		<Accordion.Item
			eventKey={category.uid}
			className='custom-accordion mx-2 px-2 border-none'>
			<Accordion.Header
				onClick={() => onClick(category.uid)}
				className='w-full flex flex-row items-center justify-between'>
				<div className='w-full flex flex-row flex-wrap items-center justify-between'>
					<div className='flex flex-row items-center justify-start'>
						<input
							type='checkbox'
							checked={isSelected('rubro', category.uid)}
							onChange={(e) => {
								handleCheckboxChange('rubro', category.uid),
									e.stopPropagation();
							}}
							className='ml-2 rounded-md size-4'
						/>
						<input
							className='ml-2 p-2 w-[40px] bg-transparent border-none outline-none '
							type='text'
							value={`${getCategoryNumber(category.uid)} `}
							readOnly
						/>
						<input
							className='p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={handleBlur}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
					<Button
						type='button'
						className='bg-transparent border-none flex items-end text-black'
						onClick={(e) => {
							e.stopPropagation();
							onDelete('rubro', category.uid);
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
						onClick={() => onAddSubcategory(category.uid)}>
						<i className='pi pi-plus text-xs font-semibold mr-2'></i>
						Nuevo SubRubro
					</button>
				</div>
				{categoryStatusUpdate === 'Cargando' ||
				categoryStatusDelete === 'Cargando' ? (
					<div className='flex items-center justify-center w-full'>
						<HashLoader size={25} />
					</div>
				) : (
					<Accordion className='w-full'>
						{subcategories.map((subcategory) => (
							<SubcategoryItem
								key={subcategory.uid}
								subcategory={subcategory}
								categoryId={category.uid}
								onTitleChange={onTitleChange}
								onDelete={onDelete}
								isSelected={isSelected}
								handleCheckboxChange={handleCheckboxChange}
								getSubcategoryNumber={getSubcategoryNumber}
							/>
						))}
					</Accordion>
				)}
			</Accordion.Body>
		</Accordion.Item>
	);
};

export default CategoryItem;
