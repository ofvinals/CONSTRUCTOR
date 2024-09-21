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
const Heading = styled('div')(() => ({
	color: '#333333',
	fontWeight: 'bold',
	fontSize: '16px',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
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
		<Draggable key={item.id} draggableId={item.id} index={index}>
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
										alt={item.assigned_To}
										src={item.photoTool}
										sx={{ marginRight: 2 }} 
									/>
									<div>
										<Heading>{item.assigned_To}</Heading>
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
