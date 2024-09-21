import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Grid, Box, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import TaskCard from './TaskCard';
import { useToolActions } from '../../../../hooks/useToolActions';

const Container = styled('div')(() => ({
	display: 'flex',
	flexDirection: 'row',
}));

const TaskList = styled('div')(() => ({
	minHeight: '100px',
	display: 'flex',
	flexDirection: 'column',
	background: '#d7dce8',
	minWidth: '341px',
	borderRadius: '5px',
	padding: '15px 15px',
	marginRight: '45px',
}));

const TaskColumnStyles = styled('div')(() => ({
	margin: '8px',
	display: 'flex',
	width: '100%',
	minHeight: '80vh',
}));

const Title = styled('span')(() => ({
	fontWeight: 'bold',
	color: '#333333',
	fontSize: 16,
	marginBottom: '1.5px',
}));

export const Kanban = () => {
	const [columns, setColumns] = useState({});
	const { tools, locations, updateTool } = useToolActions();
	const [editingColumnId, setEditingColumnId] = useState(null);
	const [title, setTitle] = useState('');

	const handleBlur = async (columnId, currentTitle) => {
		setEditingColumnId(null);
		if (title !== currentTitle) {
			await updateTool({
				id: columnId,
				values: { name: title },
			});
		}
	};

	const onDragEnd = async (result) => {
		if (!result.destination) return;
		const { source, destination } = result;
		const sourceColumn = columns[source.droppableId];
		const destLocation = locations.find(
			(location) => location.uid === destination.droppableId
		);
		const destColumnTitle = destLocation ? destLocation.title : '';

		if (source.droppableId !== destination.droppableId) {
			const sourceItems = [...sourceColumn.items];
			const destItems = [...columns[destination.droppableId].items];
			const [removed] = sourceItems.splice(source.index, 1);
			const updatedItem = {
				...removed,
				location: destColumnTitle,
				locationId: destination.droppableId,
			};
			destItems.splice(destination.index, 0, updatedItem);
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems,
				},
				[destination.droppableId]: {
					title: destColumnTitle,
					items: destItems,
				},
			});
			try {
				await updateTool({
					id: updatedItem.uid,
					values: {
						location: updatedItem.location,
						locationId: updatedItem.locationId,
					},
				});
			} catch (error) {
				console.error('Error al actualizar la ubicación:', error);
			}
		} else {
			const copiedItems = [...sourceColumn.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: copiedItems,
				},
			});
		}
	};

	useEffect(() => {
		let initialColumns = {};
		locations.forEach((location) => {
			const columnId = location.uid;
			initialColumns[columnId] = {
				title: location.title,
				items: tools.filter((tool) => tool.locationId === location.uid),
			};
		});
		const unassignedTools = tools.filter((tool) => tool.locationId === '');
		const unassignedColumnId = '2IqHNF9mRBeBumKjeFim';
		if (unassignedTools.length > 0) {
			initialColumns[unassignedColumnId] = {
				title: 'Herramientas sin asignación',
				items: unassignedTools,
			};
		}
		setColumns(initialColumns);
	}, [locations, tools]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Container>
				<TaskColumnStyles>
					{Object.entries(columns).map(([columnId, column]) => {
						const isEditing = editingColumnId === columnId;
						return (
							<Droppable key={columnId} droppableId={columnId}>
								{(provided) => (
									<TaskList
										ref={provided.innerRef}
										{...provided.droppableProps}>
										<Box
											sx={{
												width: '100%',
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}>
											<Grid
												item
												xs={10}
												className='m-2 flex flex-nowrap justify-between items-center w-full'>
												{isEditing ? (
													<TextField
														value={title}
														onChange={(e) =>
															setTitle(e.target.value)
														}
														onBlur={() =>
															handleBlur(columnId, column.title)
														}
														autoFocus
														size='small'
													/>
												) : (
													<span
														className='font-bold'
														onClick={() => {
															setEditingColumnId(columnId);
															setTitle(column.title);
														}}>
														{column.title}
													</span>
												)}
												<Title
													item
													xs={2}
													display='flex'
													alignContent='flex-end'
													justifyContent='flex-end'>
													<button>
														<i className='pi pi-trash text-red-500 text-xl hover:font-bold'></i>
													</button>
												</Title>
											</Grid>
										</Box>
										<Divider />
										{column.items.map((item, index) => (
											<TaskCard
												key={item.uid || `${columnId}-${index}`}
												item={item}
												index={index}
											/>
										))}
										{provided.placeholder}
									</TaskList>
								)}
							</Droppable>
						);
					})}
				</TaskColumnStyles>
			</Container>
		</DragDropContext>
	);
};

export default Kanban;
