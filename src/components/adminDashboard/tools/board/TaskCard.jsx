/* eslint-disable react/prop-types */
import { Card, IconButton, CardContent, Avatar, Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modals from '../../../../utils/Modals';
import useModal from '../../../../hooks/useModal';
import { useState } from 'react';
import { ToolDetails } from './ToolDetails';

const TaskCard = ({ item, index }) => {
	const [itemIdToView, setItemIdToView] = useState(null);
	const viewModal = useModal();

	return (
		<>
			<Draggable key={item.uid} draggableId={item.uid} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}>
						<Card sx={{ Width: '100px', m: '8px 1px' }}>
							<CardContent sx={{ p: '10px 10px' }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Avatar
											alt={item.name}
											src={item.photoTool}
											sx={{ marginRight: 2 }}
										/>
										<div>
											<span className='text-center font-semibold text-sm'>
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
		</>
	);
};
export default TaskCard;
