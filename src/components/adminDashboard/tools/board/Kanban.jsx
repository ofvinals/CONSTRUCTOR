import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Grid, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import TaskCard from './TaskCard';
import { useToolActions } from '../../../../hooks/useToolActions';
import ConfirmDialog from '../../../../utils/ConfirmDialog';
import { useAuth } from '../../../../hooks/useAuth';

export const Kanban = () => {
	const [columns, setColumns] = useState({});
	const {
		tools,
		locations,
		updateTool,
		updateLocation,
		deleteLocation,
		saveMovementHistory,
	} = useToolActions();
	const { loggedUser } = useAuth();
	const [editingColumnId, setEditingColumnId] = useState(null);
	const [title, setTitle] = useState('');
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState({ id: null });
	const unassignedColumnId = '2IqHNF9mRBeBumKjeFim';

	useEffect(() => {
		const initialColumns = {};
		locations.forEach((location) => {
			const columnId = location.uid;
			initialColumns[columnId] = {
				title: location.title,
				items: tools.filter((tool) => tool.locationId === location.uid),
			};
		});
		const unassignedTools = tools.filter((tool) => tool.locationId === '');
		if (unassignedTools.length > 0) {
			initialColumns[unassignedColumnId] = {
				title: 'Herramientas sin asignación',
				items: unassignedTools,
			};
		}
		setColumns(initialColumns);
	}, [locations, tools]);

	const handleBlur = async (columnId, currentTitle) => {
		if (columnId === unassignedColumnId) return;
		setEditingColumnId(null);
		if (title !== currentTitle && title.trim()) {
			await updateLocation({
				id: columnId,
				values: { title: title },
			});
		}
	};

	const handleDeleteLocation = (columnId) => {
		if (columnId === unassignedColumnId) {
			alert(
				'No se puede eliminar la columna de herramientas sin asignación.'
			);
			return;
		}
		const hasItems = tools.some((tool) => tool.locationId === columnId);
		if (hasItems) {
			alert(
				'No se puede eliminar la ubicación porque contiene herramientas asociadas.'
			);
			return;
		}
		setDeleteItem({ id: columnId });
		setShowConfirmDialog(true);
	};

	const confirmDelete = async () => {
		await deleteLocation({
			id: deleteItem.id,
		});
		setShowConfirmDialog(false);
		setDeleteItem({ id: null });
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
				await saveMovementHistory({
					toolId: updatedItem.uid,
					fromLocation: sourceColumn.title,
					toLocation: destColumnTitle,
					movedBy: loggedUser.displayName,
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

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className='flex flex-row'>
					<div className='flex w-full min-h[72vh] m-2'>
						{Object.entries(columns).map(([columnId, column]) => {
							const isEditing = editingColumnId === columnId;
							const isUnassigned = columnId === unassignedColumnId;
							return (
								<Droppable key={columnId} droppableId={columnId}>
									{(provided) => (
										<div
											className='flex flex-col w-[230px] overflow-auto mr-[45px] h-[70vh] rounded-lg bg-background px-3'
											ref={provided.innerRef}
											{...provided.droppableProps}>
											<Box>
												<Grid
													item
													xs={10}
													className='m-2 flex flex-nowrap justify-between items-center w-full'>
													{isEditing ? (
														<input
															className={`flex items-center justify-center w-[150px] h-[48px] align-middle p-1 ${
																isUnassigned
																	? 'bg-transparent font-bold'
																	: ''
															}`}
															value={title}
															readOnly={isUnassigned}
															onChange={(e) =>
																setTitle(e.target.value)
															}
															onBlur={() =>
																handleBlur(
																	columnId,
																	column.title
																)
															}
														/>
													) : (
														<span
															className='font-bold text-center min-w-[150px] h-[48px] inline-flex items-center justify-center'
															onClick={() => {
																setEditingColumnId(columnId);
																setTitle(column.title);
															}}>
															{column.title || 'N/A'}
														</span>
													)}
													<div className='flex flex-end font-bold items-end justify-end'>
														<button
															onClick={() =>
																handleDeleteLocation(columnId)
															}>
															<i className='pi pi-trash text-red-500 text-xl hover:font-bold'></i>
														</button>
													</div>
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
										</div>
									)}
								</Droppable>
							);
						})}
					</div>
				</div>
			</DragDropContext>
			<ConfirmDialog
				header='Confirmar Eliminacion'
				visible={showConfirmDialog}
				onHide={() => setShowConfirmDialog(false)}
				onConfirm={confirmDelete}
				message='¿Estás seguro que quieres eliminar la ubicacion?'
			/>
		</>
	);
};

export default Kanban;
