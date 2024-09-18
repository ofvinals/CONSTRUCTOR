/* eslint-disable react/prop-types */
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ConfirmDialog = ({ header, visible, onHide, onConfirm, message }) => (
	<Dialog
		visible={visible}
		onHide={onHide}
		header={header}
		footer={
			<div className='flex flex-row flex-wrap items-center gap-4 justify-around'>
				<Button
					label='No'
					icon='pi pi-times text-red-500 font-bold mr-2'
					onClick={onHide}
					className='p-button-text hover:bg-red-100 p-2 rounded-md shadow-none border-none'
				/>
				<Button
					label='Sí'
					icon='pi pi-check text-green-500 font-bold mr-2'
					onClick={onConfirm}
					className='p-button-text hover:bg-green-200 p-2 rounded-md shadow-none border-none'
				/>
			</div>
		}>
		<p>{message}</p>
	</Dialog>
);

export default ConfirmDialog;
