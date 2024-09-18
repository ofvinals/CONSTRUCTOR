/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { usePriceActions } from '../../../../../hooks/usePriceActions';
import HashLoader from 'react-spinners/HashLoader';
import Modals from '../../../../../utils/Modals';
import useModal from '../../../../../hooks/useModal';
import { FormPrices } from '../FormPrice/FormPrices';
import { Button } from 'primereact/button';
import { TablePrice } from './TablePrice';

const SubCategoryItem = ({
	subcategory,
	categoryId,
	onTitleChange,
	onDelete,
	handleCheckboxChange,
	getSubcategoryNumber,
	selectedItemsSubcategory,
	isBudget,
}) => {
	const { statusPriceSubcategory, getItemsPrice } = usePriceActions();
	const newModal = useModal();
	const [title, setTitle] = useState(subcategory.title);
	const [isOpen, setIsOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		getItemsPrice({
			categoryId,
			subcategoryId: subcategory.uid,
		});
	}, [isOpen]);

	const handleBlur = (e) => {
		const newTitle = e.target.value;
		if (newTitle !== subcategory.title) {
			onTitleChange(categoryId, subcategory.uid, newTitle);
		}
	};

	useEffect(() => {
		const allSelected = subcategory.items.every(
			(item) =>
				selectedItemsSubcategory[subcategory.uid]?.includes(item.uid) ||
				selectAll
		);
		setSelectAll(allSelected);
	}, [subcategory, selectedItemsSubcategory, selectAll]);

	const handleSelectAllChange = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		subcategory.items.forEach((item) => {
			handleCheckboxChange({
				categoryId,
				subcategoryId: subcategory.uid,
				itemId: item.uid,
				isChecked: newSelectAll,
			});
		});
	};

	return (
		<section>
			<Accordion.Item
				eventKey={subcategory.uid}
				className='custom-accordion border-none mt-2 '
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}>
				<Accordion.Header
					onClick={(e) => e.stopPropagation()}
					className=' flex flex-row items-center justify-between '>
					<div className='w-full flex flex-row flex-wrap items-center justify-between '>
						<div className='flex flex-row items-center justify-center '>
							<input
								type='checkbox'
								checked={selectAll}
								onChange={handleSelectAllChange}
								onClick={(e) => e.stopPropagation()}
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
								className='p-2 w-[300px] font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-black'
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								onBlur={handleBlur}
								onClick={(e) => e.stopPropagation()}
								readOnly={isBudget}
							/>
						</div>
						{isBudget ? null : (
							<div
								type='button'
								className='bg-transparent border-none flex items-end text-black shadow-none'
								onClick={(e) => {
									e.stopPropagation();
									onDelete({
										categoryId,
										subcategoryId: subcategory.uid,
									});
								}}>
								<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
							</div>
						)}
					</div>
				</Accordion.Header>
				<Accordion.Body>
					{statusPriceSubcategory === 'Cargando' ? (
						<div className='flex items-center justify-center w-full'>
							<HashLoader size={25} />
						</div>
					) : (
						<TablePrice
							selectedItemsSubcategory={selectedItemsSubcategory}
							handleCheckboxChange={handleCheckboxChange}
							categoryId={categoryId}
							subcategory={subcategory}
							category={null}
							isBudget={isBudget}
						/>
					)}
					{isBudget ? null : (
						<div>
							<Button
								type='button'
								onClick={() => {
									newModal.openModal();
								}}
								className='mt-3 flex items-center flex-row hover:bg-[#ffe57c] p-1 rounded-md text-sm'>
								<i className='pi pi-plus text-xs font-semibold mr-2'></i>
								Nuevo Item de SubRubro
							</Button>
						</div>
					)}
				</Accordion.Body>
			</Accordion.Item>
			<div>
				<Modals
					fullscreen={true}
					isOpen={newModal.isOpen}
					onClose={newModal.closeModal}
					title='Ingresar Nuevo Item de SubRubro'>
					<FormPrices
						onClose={newModal.closeModal}
						subcategoryId={subcategory.uid}
						categoryId={categoryId}
						mode='create'
					/>
				</Modals>
			</div>
		</section>
	);
};

export default SubCategoryItem;
