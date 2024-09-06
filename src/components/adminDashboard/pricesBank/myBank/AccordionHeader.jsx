/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';

const AccordionHeader = ({
	title,
	selectAll,
	onSelectAllChange,
	onTitleChange,
   handleBlur,
	onDelete,
	onClick,
}) => {
	return (
		<div className='w-full flex flex-row flex-wrap items-center justify-between'>
			<div className='flex flex-row items-center justify-start'>
				<input
					type='checkbox'
					checked={selectAll}
					onChange={onSelectAllChange}
					onClick={(e) => e.stopPropagation()}
					className='ml-2 rounded-md size-4'
				/>
                            <input
                    className='ml-2 p-2 w-[40px] bg-transparent border-none outline-none text-center font-semibold'
                    type='text'
                    value={categoryNumber}
                    readOnly
                />
				<input
					type='text'
					value={title}
					onChange={onTitleChange}
					onBlur={onTitleChange}
					onClick={(e) => e.stopPropagation()}
					className='p-2 w-fit font-semibold rounded-md hover:border-1 bg-transparent focus:border-black focus:bg-white'
				/>
			</div>
			<Button
				type='button'
				className='bg-transparent border-none flex items-end text-black'
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}>
				<i className='pi pi-trash ml-2 p-2 rounded-md hover:text-red-500 font-semibold text-lg'></i>
			</Button>
		</div>
	);
};

export default AccordionHeader;
