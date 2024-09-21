/* eslint-disable react/prop-types */
import {
	Card,
	IconButton,
	Typography,
	CardContent,
	Avatar,
	Box,
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/system';

const SubTitle = styled('span')(() => ({
	marginBottom: '1.5px',
	color: '#333333',
	fontWeight: 'bold',
}));

const rightIconAction = (
	<>
		<IconButton>
			<MoreVertIcon />
		</IconButton>
	</>
);

const TaskCard = ({ item, index }) => {
	return (
		<Draggable key={item.uid} draggableId={item.uid} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}>
					<Card sx={{ minWidth: 275, m: '8px 1px' }}>
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
										<SubTitle>{item.name}</SubTitle>
									</div>
								</Box>
								{rightIconAction}
							</Box>
							<Typography
								sx={{ fontSize: 14 }}
								color='text.secondary'
								gutterBottom>
								{item.task}
							</Typography>
						</CardContent>
					</Card>
				</div>
			)}
		</Draggable>
	);
};
export default TaskCard;
