/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap';

const TableActions = ({ onEdit, onDelete }) => {
	return (
		<div className='flex flex-row'>
			<Button
				type='button'
				className='bg-transparent border-none shadow-none'
				onClick={onEdit}>
				<i className='pi pi-pen-to-square font-semibold  text-green-500 hover:text-green-300'></i>
			</Button>
			<Button
				type='button'
				className='bg-transparent border-none shadow-none'
				onClick={onDelete}>
				<i className='pi pi-trash font-semibold  text-red-500 hover:text-red-300'></i>
			</Button>
		</div>
	);
};

export default TableActions;
