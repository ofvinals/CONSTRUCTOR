/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { usePriceActions } from '../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../utils/Modals';
import useModal from '../../../../hooks/useModal';
import { FormPrices } from './FormPrices';

const SubCategoryItem = ({
	subcategory,
	categoryId,
	onTitleChange,
	onDelete,
	isSelected,
	handleCheckboxChange,
	getSubcategoryNumber,
}) => {
	const [title, setTitle] = useState(subcategory.title);
	const { statusSubcategory } = usePriceActions();
	const newModal = useModal();
	const handleBlur = (e) => {
		const newTitle = e.target.value;
		console.log('New Title:', newTitle);
		console.log('Category ID:', categoryId);

		if (newTitle !== subcategory.title) {
			onTitleChange('subrubro', subcategory.uid, newTitle, categoryId);
		}
	};
	return (
		<>
			<Accordion.Item
				eventKey={subcategory.uid}
				className='custom-accordion border-none mt-2 '>
				<Accordion.Header className=' flex flex-row items-center justify-between '>
					<div className='w-full flex flex-row flex-wrap items-center justify-between'>
						<div className='flex flex-row items-center justify-center'>
							<input
								type='checkbox'
								checked={isSelected('subrubro', subcategory.uid)}
								onChange={(e) => {
									e.stopPropagation(),
										handleCheckboxChange('subrubro', subcategory.uid);
								}}
								className='ml-2 rounded-md size-4'
							/>
							<input
								className='ml-2 p-2 w-[45px] rounded-md outline-none bg-transparent  '
								type='text'
								value={`${getSubcategoryNumber(
									categoryId,
									subcategory.uid
								)} `}
								readOnly
							/>
							<input
								className='p-2 w-[300px] rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-black'
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
								onDelete('subrubro', subcategory.uid, categoryId);
							}}>
							<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
						</Button>
					</div>
				</Accordion.Header>
				{statusSubcategory === 'Cargando' ? (
					<div className='flex items-center justify-center w-full'>
						<HashLoader size={25} />
					</div>
				) : (
					<Accordion.Body>
						{subcategory.content}
						<button
							onClick={() => {
								newModal.openModal();
							}}
							className='mt-3 flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
							<i className='pi pi-plus text-xs font-semibold mr-2'></i>
							Nuevo Item de SubRubro
						</button>
					</Accordion.Body>
				)}
			</Accordion.Item>
			<Modals
				isOpen={newModal.isOpen}
				onClose={newModal.closeModal}
				title='Ingresar Nuevo SubRubro'>
				<FormPrices onClose={newModal.closeModal} mode='create' />
			</Modals>
		</>
	);
};

export default SubCategoryItem;
