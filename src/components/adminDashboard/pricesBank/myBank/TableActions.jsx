/* eslint-disable react/prop-types */
import { Button } from 'primereact/button';

const TableActions = ({ onEdit, onView, onDelete }) => {
  return (
    <td className='flex gap-4 items-center justify-around'>
      <Button type='button' className='bg-transparent border-none' onClick={onEdit}>
        <i className='pi pi-pen-to-square font-bold text-xl text-green-500 hover:text-red-300'></i>
      </Button>
      <Button type='button' className='bg-transparent border-none' onClick={onView}>
        <i className='pi pi-eye font-bold text-xl text-blue-500 hover:text-blue-300'></i>
      </Button>
      <Button type='button' className='bg-transparent focus:border-none focus:shadow-none' onClick={onDelete}>
        <i className='pi pi-trash font-bold text-xl text-red-500 hover:text-red-300'></i>
      </Button>
    </td>
  );
};

export default TableActions;

