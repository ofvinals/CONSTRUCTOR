/* eslint-disable react/prop-types */
import { Card, IconButton, CardContent, Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modals from '../../../../utils/Modals';
import useModal from '../../../../hooks/useModal';
import { useState } from 'react';
import { ToolDetails } from './ToolDetails';
import Avatar from 'react-avatar';

const TaskCard = ({ item, index }) => {
	const [itemIdToView, setItemIdToView] = useState(null);
	const viewModal = useModal();
	const photoModal = useModal();

	return (
		<>
			<Draggable key={item.uid} draggableId={item.uid} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}>
						<Card
							sx={{
								Width: '120px',
								m: '8px 1px',
								borderRadius: '15px',
								backgroundColor: '#fef08a',
							}}>
							<CardContent sx={{ p: '5px 5px' }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										{item.photoTool ? (
											<button
												className='text-center'
												type='button'
												onClick={(e) => {
													e.stopPropagation();
													photoModal.openModal();
												}}>
												<img
													src={item.photoTool}
													alt='foto de perfil'
													className='rounded-full m-1 h-[40px]'
												/>
											</button>
										) : (
											<Avatar
												name={item.name}
												size='40'
												round={true}
												className='m-1 text-center'
											/>
										)}
										<div className='flex items-center'>
											<span className='text-center font-semibold text-sm pl-2'>
												{item.name}
											</span>
										</div>
									</Box>
									<IconButton
										onClick={() => {
											viewModal.openModal();
											setItemIdToView(item.uid);
										}}>
										<MoreVertIcon />
									</IconButton>
								</Box>
							</CardContent>
						</Card>
					</div>
				)}
			</Draggable>
			<Modals
				isOpen={viewModal.isOpen}
				onClose={viewModal.closeModal}
				size='md'
				title='Movimientos de la Herramienta'>
				<ToolDetails onClose={viewModal.closeModal} toolId={itemIdToView} />
			</Modals>
			<Modals
				isOpen={photoModal.isOpen}
				onClose={photoModal.closeModal}
				size='md'
				title='Fotografia Ampliada'>
				<img
					src={item.photoTool}
					alt='foto de herramienta ampliada'
					style={{ maxHeight: '90%', maxWidth: '90%' }}
				/>
			</Modals>
		</>
	);
};
export default TaskCard;
